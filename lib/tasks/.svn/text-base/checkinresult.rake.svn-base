namespace :report do

  desc "operates on report"

  require 'find'
  require 'net/ftp'
  require 'zlib'
  require 'archive/tar/minitar'
  include Archive::Tar



  def summary_result(build_id)

    build = Build.find(build_id)

    unless build
      puts "#{build_id} doesn't exist, exit"
      return 
    end

    buildno = build.buildno

    puts "start to summary #{buildno}"

    Result.module_list.each do |m|
      #      puts "process #{m}"
      nt = Result.nt_cases(build_id, m).length
      pass = Result.pass_cases(build_id, m).length
      fail = Result.real_fail_cases(build_id, m).length
      total = pass + fail + nt
      duration = Result.duration(build_id, m)

      current= Summary.find(:all, :conditions => ["build_id=? and module=?",build_id, m])

      if current.empty?
        puts "add #{build_id}:#{m}"
        Summary.create do |s|
          s.build_id = build_id
          s.module = m
          s.total = total
          s.pass = pass
          s.fail = fail
          s.nt = nt
          s.duration = duration
        end
      else
        # update "current" summary
        puts "Update #{buildno}:#{m}"
        current[0].update_attributes :total=>total, :pass=>pass, :fail=>fail, :nt=>nt
      end
    end
  end


  def checkin_tcmtresult(tcmtresult, buildno, load_ascii = true, product_id = 2)

    pat = /reports\/(\d+)\/(?:\w*)_imss_(\d+)\S*\/tcmtresult/i
    # Four identical groups in this pattern
    refs = pat.match(tcmtresult)

    # just go back if 'tcmtresult' is not as expected
    return if refs.nil?

    datastr = refs[2]


    puts(datastr)
    runtime = Time.gm(datastr[0,4],datastr[4,2],datastr[6,2],datastr[8,2],datastr[10,2],datastr[12,2])


    # grab Product for "imsx_linux_7.1"
    #    product = Product.find(:first, :conditions=>["name=? and version=? and platform=?", 'imsx', '7.1', 'linux'])
    product = Product.find(product_id)

    # create a build if not available
    build = Build.find(:first, :conditions=>["product_id=? and buildno=?", product.id, buildno])
    unless build
      build = Build.new do |b|
        b.buildno = buildno
        b.build_type = 'daily'
      end
      product.builds << build
    end

    build_id = build.id
    submission_id = 0

    
    # just skip this file if this tcmtresult has been submitted via Automation
    unless Submission.find(:all, :conditions=>["build_id=? and runtime=?", build_id, runtime]).empty?
      puts "#{tcmtresult} has been submitted already, skip it."
      return
    end


    File.open(tcmtresult) do |f|
      # submission for this tcmtresult
      submission = Submission.new
      
      #     submission.buildno = buildno
      submission.comments = "submitted via rake task"
      submission.owner = "automation"
      submission.created_at = Time.now.to_s
      submission.result_file_name = 'tcmtresult'
      submission.data = open(tcmtresult).readlines
      submission.runtime = runtime

      submission_id = submission.id

      submission.save
      

      #     submission will get saved at this time...
      build.submissions << submission


      f.each_line do |line|
        #remove "return" in the end of line, otherwise, result value is not valid
		next if line =~ /^\s*$/
        line.chomp!
        defined_id, result = line.split(':', 2)

        #                    puts "Defined_ID: #{defined_id}<---"
        #          puts "result: #{result}<---"
        #
        #          pre_round_cases = Result.find(:all, :conditios=>["buildno=? and defined_id = ?", buildno, defined_id])
        #          # if result is "PASS"
        #          if result == 'PASS'
        #
        #            pre_round_cases.each do |x|
        #              x.update_attribute('final_result', 'PASS')
        #            end
        #          elsif result == 'FAIL'
        #
        #          end

        
        result = Result.create do |r|
          r.defined_id = defined_id
          r.module = "#{defined_id.split('-').first(1)[0].downcase.capitalize}"
          #            puts "Module: #{r.module}<----"
          r.result = result
          r.submission_id = submission.id
          r.build_id = build_id
          #            r.final_result = result        
        end
        
        # load stpes by parsing AsciiReport if AsciiReport given
        if load_ascii
          ascii = tcmtresult.gsub(/tcmtresult/, 'AsciiReport')
          if File.exist?(ascii)
            check_steps(ascii, result.id, defined_id)
          end
        end

      end # handle each_line
    end # close file

  end

  def check_steps(ascii, result_id, defined_id)
#    puts "Load #{ascii}, defined_id: #{defined_id}, result_id: #{result_id}"

    File.open(ascii) do |f|
      desc = ""      
      step_index = 1
      params = ""
      found = 0
      
      f.each_line do|line|
        line.chomp!
        # puts line
        if line =~ /^DESC = (.*)/
          break if found == 1
          desc= $1          
#          found = 0
#          step_index = 1
        end

#        if line =~ /^CASEID = (\S*)/
        if line =~ /^CASEID = #{defined_id}_1:(\d+)/
            puts "find defined id: #{defined_id}"
            found = 1
            case_duration = $1

            # update 'duration' for test case
            Result.find(result_id).update_attributes :duration=>case_duration
        end      

        # K.Y, 4/17/2009,
        # Using non-greedy matching. 
        if found == 1 and line =~ /(\S*)::(\S*?)\((.*)\) (\d+)\s+(.*)/
          kmodule = $1
          keyword = $2
          params = $3
          duration = $4 # support duration
          result = $5

#          puts "#{step_index}@$#{kmodule}::#{keyword}(#{params})  #{defined_id} --> #{result}"

          # Good, save this step
          Step.create do |s|
            s.result_id = result_id
            s.kmodule = kmodule
            s.keyword = keyword
            s.param = params
            s.step_index = step_index
            s.result = (result == "Ok" ? 1 : 0)
            s.duration = duration
          end

          step_index = step_index + 1

        end
      end
    end
  end


  def match(*paths)
    matched = []
    Find.find(*paths) { |path| matched << path if yield path }
    return matched
  end


  #  def load_step


  task :summary, [:build_start, :build_stop] => :load do |t, args|
    desc "summary build and module stastics info and insert into sumamry tables"

    build_list = Result.build_list

    build_start=args.build_start
    build_stop=args.build_stop ||build_start

    puts "Bulid_start : #{build_start}"
    puts "Bulid_stop : #{build_stop}"

    build_list.select{|x| x.buildno >= build_start and x.buildno <= build_stop}.each do |b|
      summary_result(b)
    end

    # send out notification
    lastest_buildno = Build.find(:first, :order => "buildno DESC").buildno
    product_id = 2
#    Notifier.deliver_daily_report("allen_wang@trendmicro.com.cn, snap_zhan@trendmicro.com.cn, kevin_k_chen@trendmicro.com.cn,wei_dai@trendmicro.com.cn, bob_liao@trendmicro.com.cn, ricky_qiu@trendmicro.com.cn, shu_liu@trendmicro.com.cn, yiping_shen@trendmicro.com.cn, jianxin_guo@trendmicro.com.cn,zhennan_sun@trendmicro.com.cn, chao_he@trendmicro.com.cn, kevin_young@trendmicro.com.cn",lastest_buildno, product_id)
  end
    

  #  task :sync, [:buildno] => :environment do |t, args|
  task :sync =>  :environment do
    desc "figure out whether it exist"

    # downlaod
  end


  task :load_step, [:build_start, :build_stop] => :download do |t, args|

    buildnos = Result.buildno_list

    build_start=args.build_start
    build_stop=args.build_stop ||build_start

    puts "Bulid_start : #{build_start}"
    puts "Bulid_stop : #{build_stop}"


    # get tcmtresult
    details = match("reports/#{buildno}") { |p|  File.split(p)[1] == 'AsciiReport'}

    puts details

    # sorting them, so the lastest one get in last.
    # So the final result is the one checked in lastly.
    details.reverse.each do |ascii|
      checkin_ascii(ascii, buildno)
    end
    
  end


  task :test_load_step => :environment do |t, args|
    buildno=args.buildno

    details = match("reports/#{buildno}") { |p|  File.split(p)[1] == 'AsciiReport'}

    puts "=====details===="
    puts details
  end

  task :load, [:build_start, :build_stop] => :download do |t, args|
#  task :load, [:build_start, :build_stop] => :environment do |t, args|
    #    [Result].each(&:delete_all)

    build_start=args.build_start
    build_stop= args.build_stop || build_start

    puts "Bulid_start : #{build_start}"
    puts "Bulid_stop : #{build_stop}"

    #    Dir.entires("reports").each{|x| puts x}

    #    Rake::Task["report:download"].invoke(build_start)

    puts Dir.pwd
    
    Dir.entries("reports").select{|x| x >= build_start and x<= build_stop}.each do |buildno|
      # get tcmtresult
      tcmtresults = match("reports/#{buildno}") { |p|  File.split(p)[1] == 'tcmtresult'}

      puts tcmtresults

      # sorting them, so the lastest one get in last.
      # So the final result is the one checked in lastly.
      tcmtresults.reverse.each do |result|
        checkin_tcmtresult(result, buildno)
      end
    end
  end


  

  task :test do |t|
    puts "#{RAILS_ROOT}"
    Rake::Task["report:download"].invoke('1112')
  end

  task :download, [:build_start, :build_stop] => :environment do |t, args|

    #    def process_zipfile(zip, path='')
    #      if zip.file.file? path
    #        puts %{#{path}: "#{zip.read(path)}"}
    #      else
    #        unless path.empty?
    #          path += '/'
    #          puts path
    #        end
    #        zip.dir.foreach(path) do |filename|
    #          process_zipfile(zip, path + filename)
    #        end
    #      end
    #    end
    def unzip_file(filename, dest_dir)
      cmd = "#{RAILS_ROOT}/tool/unzip.exe -o #{filename} -d #{dest_dir}"
      puts cmd

      begin
        system(cmd)
      rescue
        puts "unzip #{filename} error, ignore it"
      end
    end

    def download_result(buildno)
      puts "start download report for build: {#{buildno}}"

      Dir.mkdir('reports') unless File.exist? 'reports'
      Dir.mkdir("reports/#{buildno}") unless File.exist? "reports/#{buildno}"

      ftp = Net::FTP.open('10.204.16.2') do |ftp|
        ftp.login 'test', 'testtest'
        puts "loginin"
        ftp.chdir('Home/IMSS/Husky/Va')

        #      files = ftp.list("*_#{buildno}.tar.gz")
        files = ftp.list("*_#{buildno}.zip")

        if files.empty?
          puts "No results for #{buildno} avaiable"
          return
        end

        files.each do |file|
          #    puts "File: #{file}"
          rf = file.split()[-1]
          puts "Filename: #{rf}"

          lf ="reports/#{buildno}/#{rf}"

          unless File.exist?(lf)
            ftp.getbinaryfile(rf,lf,1024)

            # ---------------------------------------------------------------
            #        unzip tar.gz files, comments it
            #         tgz = Zlib::GzipReader.new(File.open(lf, 'rb'))
            ##        Warning: tgz will be closed!
            #         Minitar.unpack(tgz, "reports/#{buildno}")
            # ---------------------------------------------------------------

            unzip_file(lf, "reports/#{buildno}")
          else
            puts "#{lf} exists, skip it"
          end

        end

      end

    end
    

    build_start=args.build_start
    build_stop=args.build_stop ||build_start

    puts "Bulid_start : #{build_start}"
    puts "Bulid_stop : #{build_stop}"

    (build_start..build_stop).each() { |i| download_result(i) }
  end
end
  
