class Result < ActiveRecord::Base
  validates_presence_of :build_id
  belongs_to :submission
  belongs_to :testbuild, :class_name => "Build", :foreign_key => "build_id"
  has_one :pfc

  #  def uploaded_result=(result_field)
  #    self.result_filename = base_part_of(picture_field.original_filename)
  #
  #    # start to parsing result file
  #
  #
  #  end
  #
  #  def base_part_of(file_name)
  #    File.basename(file_name).gsub(/[^\w._-]/, '' )
  #  end


  # return all the modules listed in table "results"
  def Result.module_list
    Result.find(:all, :group=>'module').collect {|x| x.module}
  end

  def Result.real_fail_cases(build_id,m)
    overall_fail_cases = Result.find_all_by_module(m, :conditions=>["build_id = ? and result = 'FAIL'", build_id], :group=>'defined_id')
    overall_fail_cases.find_all do |obj|
      Result.find_all_by_module(m,
        :conditions=>["build_id = ? and defined_id = ? and result = 'PASS'", build_id, obj.defined_id]).empty?
    end
  end

  # cases ever passed
  def Result.suspicious_cases(build_id, m)
    overall_fail_cases = Result.find_all_by_module(m, :conditions=>["build_id = ? and result = 'FAIL'", build_id], :group=>'defined_id')
    overall_fail_cases.reject do |obj|
      Result.find_all_by_module(m,
        :conditions=>["build_id = ? and defined_id = ? and result = 'PASS'", build_id, obj.defined_id]).empty?
    end
  end

  def Result.nt_cases(build_id, m)
    Result.find_all_by_module(m, :conditions=>["build_id = ? and result = 'NT'", build_id], :group=>'defined_id')
  end

  def Result.build_id_list
    return Result.find(:all,  {:group => "build_id"}).collect { |r| r.build_id }
  end

  def Result.build_list
    #    return Result.find(:all, :conditions=>["product_id = ?", product_id],  :group => "build_id").collect { |r| r.build }
    return Result.find(:all,  :group => "build_id").collect { |r| r.testbuild }.sort_by{|b| b.buildno}
  end

  def Result.buildno_list
    return Result.find(:all, :group => "build_id").collect { |r| r.testbuild.buildno}
  end
  

  def Result.pass_cases(build_id,m)
    Result.find_all_by_module(m, :conditions=>["build_id = ? and result = 'PASS'", build_id], :group=>'defined_id')
  end

  def Result.duration(build_id, m)
    #    find_by_sql ["Select sum(duration) as total from results where build_id = ? and module = ?", build_id, m]
    #    Result.count(:conditions =>["build_id = ? and module = ?", build_id, m])
    Result.sum(:duration, :conditions =>["build_id = ? and module = ?", build_id, m])
  end

  # figure out which cases is not stable among lastest several builds
  # for example
  # 
  def Result.change_list_between_builds(buildno, offset, m)

    full_build_list = Result.buildno_list.sort # asc...
    history_build_list = full_build_list.select{|b| b.to_i <= buildno.to_i}
    start_buildno = history_build_list[-offset]
    

    
    Result.find_by_sql(%Q@
          select * from
           (select defined_id, GROUP_CONCAT(final order by buildno ASC) as result_list, GROUP_CONCAT(buildno order by buildno ASC) as build_list from
            (select defined_id, FIND_IN_SET('PASS',GROUP_CONCAT(result))as final, buildno, module
              from results join builds on builds.id = results.build_id
              where builds.buildno>=#{start_buildno} and builds.buildno<=#{buildno} and  module= '#{m}' group by defined_id, build_id
            ) as r
           group by defined_id ) as f
            where result_list REGEXP "(0,1|0,2|2,0|1,0|0+)" order by result_list
      @)
  end


  # Smoke test result should "compliled" the final result
  def Result.smoke_test_result(buildid)
    Result.find_by_sql(%Q@
      select s.defined_id, s.owner, s.enable, r.final_result, r.build_id, r.module from smokes as s
          left join (select GROUP_CONCAT(result) as final_result, results.defined_id, results.build_id, results.module from results where build_id = #{buildid} group by defined_id) as r
            on s.defined_id = r.defined_id group by s.defined_id order by s.defined_id
      @)
  end

end
