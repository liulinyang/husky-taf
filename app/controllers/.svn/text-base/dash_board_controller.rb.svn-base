class DashBoardController < ApplicationController
  in_place_edit_for :build, :comments


  Build_list_length = 18
  Module_name_length = 4
  
  #  caches_page :index
  caches_page :build_status, :module_status, :change, :trend
  
  

  def sync
    buildno = params[:buildno]
    logger.info("Start to Sync with cn-labfs")
    railsroot = "#{Rails.root}".gsub(/\//,"\\")
    cmd = "cd /d #{railsroot} && rake report:summary[#{buildno}] --trace >> #{railsroot}\\log\\rake.log"
    logger.info(cmd)
    system(cmd)

    render :update do |page|
      page.replace_html 'sync_result', "Hit F5, Refresh Now!"
      page.visual_effect(:highlight, 'sync_result')
    end

    #    flash[:notice] = "build #{buildno} Sync ready "

    #    redirect_to :action=>:index
  end

 

  def prepare_common_elements
    product_id = 2

    @lastest_buildno = get_lastest_buildno
    @lastest_build = Build.find(:first, :conditions => ["buildno = ? and product_id = ?" , @lastest_buildno, product_id])
    @lastest_build_id = @lastest_build.id

    # only get last 18 builds
    @buildnos = get_buildnos.reverse
    @build_list = Result.build_list.sort_by {|b| b.buildno}.reverse
    @modules = Result.module_list


    @current_build_id = params[:build_id] || @lastest_build_id
    @current_module = params[:module] || @modules[0]

    @this_build = Build.find(@current_build_id)
    @current_buildno = @this_build.buildno
  end

  def change
    prepare_common_elements
    @changes = {}
    get_module_list(@current_build_id).each do |m|
      @changes[m] = Result.change_list_between_builds(@current_buildno,3,m) # for each module, we'got change-records.
    end

    @build_report_stat = {}    
    get_module_list(@current_build_id).each do |m|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", @current_build_id, m])
      #      checked_count = Pfc.find(:all, :conditions=>["build_id=? and module=?", @current_build_id, m]).length
      @build_report_stat[m] = [this.pass, this.fail, this.nt, this.duration]
      #      @build_report_stat[m] = [this.pass, this.fail, this.nt, checked_count]
    end
  end

  def module_status
    prepare_common_elements
    @module_graph = open_flash_chart_object(600,300,"/dash_board/module_graph_line?module=#{@current_module}&buildid=#{@current_build_id}")
    @build_report_stat = {}
    @module_report_stat = {}

    get_module_list(@current_build_id).each do |m|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", @current_build_id, m])
      next if this.nil?
      #      checked_count = Pfc.find(:all, :conditions=>["build_id=? and module=?", @current_build_id, m]).length
      @build_report_stat[m] = [this.pass, this.fail, this.nt, this.duration]
      #      @build_report_stat[m] = [this.pass, this.fail, this.nt, checked_count]
    end

    Result.build_list().each do |build|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", build.id, @current_module])
      unless this.nil?
        @module_report_stat[build.buildno] = [ this.pass, this.fail, this.nt, this.duration]
      end
    end

    
  end

  def build_status
    prepare_common_elements
    @build_graph = open_flash_chart_object(600,300,"/dash_board/build_graph_stackbar?id=#{@this_build.id}")
    @build_report_stat = {}
    @module_report_stat = {}

    get_module_list(@current_build_id).each do |m|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", @current_build_id, m])
      next if this.nil?
      #      checked_count = Pfc.find(:all, :conditions=>["build_id=? and module=?", @current_build_id, m]).length
      @build_report_stat[m] = [this.pass, this.fail, this.nt, this.duration]
      #      @build_report_stat[m] = [this.pass, this.fail, this.nt, checked_count]
    end

    Result.build_list().each do |build|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", build.id, @current_module])
      unless this.nil?
        @module_report_stat[build.buildno] = [ this.pass, this.fail, this.nt, this.duration]
      end
    end

    @comment_list = @this_build.comments
    @comment = Comment.new do |c|
      if logged_in?
        c.user = current_user.login
      else
        c.user = "anonymous"
      end
      c.buildno = @current_buildno
    end
  end


  # display smoke test report
  def smoke_status
    prepare_common_elements
    @smoke_test_result = Result.smoke_test_result(@current_build_id)
  end


  # show total executed test case trend
  def trend
    prepare_common_elements
    @build_trend_graph = open_flash_chart_object(600,300,"/dash_board/build_trend_graph_line")
  end
  
  def index
    prepare_common_elements
  end

  


  def index_contains_tab_version

    # current we set product as "imsx 7.1 linux" 
    product_id = 2

    

    @lastest_buildno = get_lastest_buildno
    @lastest_build = Build.find(:first, :conditions => ["buildno = ? and product_id = ?" , @lastest_buildno, product_id])
    @lastest_build_id = @lastest_build.id

    # only get last 18 builds
    @buildnos = get_buildnos.reverse
    @build_list = Result.build_list.sort_by {|b| b.buildno}.reverse
    @modules = Result.module_list
    
    
    @current_build_id = params[:build_id] || @lastest_build_id
    @current_module = params[:module] || @modules[0]
    
    @this_build = Build.find(@current_build_id)
    @current_buildno = @this_build.buildno

    @build_graph = open_flash_chart_object(600,300,"/dash_board/build_graph_stackbar?id=#{@this_build.id}")

    @build_pie_graph = open_flash_chart_object(600,300,"/dash_board/build_graph_pie?id=#{@this_build.id}")
    
    #    @module_graph = open_flash_chart_object(600,300,"/dash_board/module_graph_stackbar?module=#{@current_module}")
    @module_graph = open_flash_chart_object(600,300,"/dash_board/module_graph_line?module=#{@current_module}&buildid=#{@current_build_id}")

    @build_trend_graph = open_flash_chart_object(600,300,"/dash_board/build_trend_graph_line")
    
    @build_report_stat = {}
    @module_report_stat = {}
    @changes = {}

    get_module_list(@current_build_id).each do |m|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", @current_build_id, m])
      next if this.nil?
      #      checked_count = Pfc.find(:all, :conditions=>["build_id=? and module=?", @current_build_id, m]).length
      @build_report_stat[m] = [this.pass, this.fail, this.nt, this.duration]
      #      @build_report_stat[m] = [this.pass, this.fail, this.nt, checked_count]
    end
    
    Result.build_list().each do |build|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", build.id, @current_module])
      unless this.nil?
        @module_report_stat[build.buildno] = [ this.pass, this.fail, this.nt, this.duration]
      end
    end

    #    @build_comments = ""
    #
    #    this_build = Build.find(:first, :conditions=>["buildno=?",@current_buildno])
    #    unless this_build.nil?
    #      @build_comments = this_build.comments
    #    end

    #    @this_build = Build.find(:first, :conditions=>["buildno=?",@current_buildno])

    @comment_list = @this_build.comments
    @comment = Comment.new do |c|
      if logged_in?
        c.user = current_user.login
      else
        c.user = "anonymous"
      end
      c.buildno = @current_buildno
    end

    get_module_list(@current_build_id).each do |m|      
      @changes[m] = Result.change_list_between_builds(@current_buildno,3,m) # for each module, we'got change-records.
    end

  
    @smoke_test_result = Result.smoke_test_result(@current_build_id)


    # running progress
    #    @running_status = Pmodule.progress(@current_build_id)
        
    
    #    # the results
    #    results = Result.find_all_by_buildno(@current_buildno)
    #    # group by subject and use subject as the key
    #    results.group_by(&:module).each do |tmodule, result|
    #      @report_stat[tmodule.to_s] = [
    #        result.select {|x| x.result == 'PASS'}.length,
    #        result.select {|x| x.result == 'FAIL'}.length,
    #        result.select {|x| x.result == 'NT'}.length      ]
    #    end
  end

  def save_comment
    c = Comment.new(params[:comment])

    @this_build = Build.find(:first, :conditions=>["buildno=?",c.buildno])
    @this_build.comments << c

    @this_build.save
    c.save

    redirect_to :action=>:index
  end

  def toggle_details
    logger.info("param")

    details_type = params[:id]
    render(:update) do |page|
      page.visual_effect :highlight, "#{details_type}_details_link", :duration => 1
      page.visual_effect :toggle_slide, "#{details_type}_details_table"

      page.replace_html 'sync_result', "Click table header to sort the column"
      page.visual_effect :appear, 'sync_result'
      page.visual_effect(:highlight, 'sync_result', :duration => 2)
      page.visual_effect :fade, 'sync_result'
    end
  end

  
  def graph_code
    title = Title.new("MY TITLE")

    value = BarBase.new({:val => 50, :colour => "#ff00ff"})
    #      bar.append_stack(value)

    bar = BarStack.new
    #      bar.keys= [{:text => "haha", :colour => "#50284A"}]
    #      bar.set_keys([{:text => "pass", :colour => "#50284A"}])
    #      bar.set_colours(["#459a89", "#9a89f9", "#47092E", ""#A4092E"], "#47398E")
    bar.colours = ["#C4D318", "#50284A", "#7D7B6A"]
    bar.append_stack([1,23,32,4,value] )
    bar.append_stack([23,42,3,4] )


    bar.append_key("subject", 3)
    chart = OpenFlashChart.new


    chart.set_title(title)
    chart.add_element(bar)
    #      chart.keys = [{:text => "haha", :colour => "#50284A"}]
    #      chart.add_element(bar2)

    x_axis = XAxis.new
    x_axis.labels = ['tmodules', 'policy', 'AU', 'Step']

    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, 150, 10)

    chart.x_axis = x_axis
    chart.y_axis = y_axis

    render :text => chart.to_s
  end



  def get_module_list(build_id)
    #    build = Build.find(:first, :conditions=>["buildno = ? and product_id = ?", buildno, product_id])
    build = Build.find(build_id)
    return Result.find(:all, :conditions=>["build_id = ?", build.id], :group => "module").collect { |r| r.module }
  end


  # draw a line to show the trend of build status while time goes. 
  def build_trend_graph_line
    y_axis_length = 0
    report_stat = {:total => [], :pass => [], :passrate=>[]}
	
	build_id_list = Result.build_list.collect{ |b| b.id }.last(Build_list_length)
    # build_id_list = Result.build_list.collect{ |b| b.id }.slice(-18,18)

    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]

    build_id_list.each do |build_id|
      build_total = Summary.sum(:total, :conditions => "build_id = #{build_id}" )
      build_pass = Summary.sum(:pass, :conditions => "build_id = #{build_id}" )

      build_passrate = 100*build_pass.to_f/build_total.to_f
      
      report_stat[:total].push(build_total)
      report_stat[:pass].push(build_pass)
      report_stat[:passrate].push(build_passrate)

      if build_total > y_axis_length then
        y_axis_length = build_total
      end

      #      this = Summary.find(:first, :conditions => ["build_id=? and module=?", build_id, m])
      #
      #      unless this.nil?
      #        report_stat[:pass].push(this.pass)
      #        report_stat[:fail].push(this.fail)
      #        report_stat[:nt].push(this.nt)
      #        report_stat[:total].push(this.total)
      #
      #        if this.total > y_axis_length then
      #          y_axis_length = this.total
      #        end
      #      else
      #        report_stat[:pass].push(0)
      #        report_stat[:fail].push(0)
      #        report_stat[:nt].push(0)
      #        report_stat[:total].push(0)
      #      end

    end

    y_axis_length = (y_axis_length*1.25).round

    line_dot = LineDot.new
    line_dot.text = "P-Rate"
    line_dot.width = 1
    line_dot.colour = '#459a89'
    line_dot.dot_size = 2
    line_dot.values = report_stat[:passrate]

    line_hollow = LineHollow.new
    line_hollow.text = "Pass"
    line_hollow.width = 1
    line_hollow.colour = '#9a89f9'
    line_hollow.dot_size = 2
    line_hollow.values =  report_stat[:pass]

    line = LineHollow.new
    line.text = "Total"
    line.width = 1
    line.colour = '#5E4725'
    line.dot_size = 2
    line.values =  report_stat[:total]

    y = YAxis.new
    y.set_range(0,20,5)


    # some title
    title = Title.new("IMSx8.2 VA Test Result Trend", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = Result.build_list.collect{|b|b.buildno}.sort[-18, 18]

    x_legend = XLegend.new("Build No")
    x_legend.set_style('{font-size: 13px; color: #778877}')

    y_legend = YLegend.new("#Case & P-rate")
    y_legend.set_style('{font-size: 13px; color: #778877}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffff'
    graph.title = title
    graph.x_axis = x_axis
    graph.y_axis = y_axis

    graph.add_element(line_dot)
    graph.add_element(line_hollow)
    graph.add_element(line)

    graph.set_x_legend(x_legend)
    graph.set_y_legend(y_legend)

    # set tooltip
    t = Tooltip.new
    t.set_shadow(false)
    t.stroke = 5
    t.colour = '#6E604F'
    t.set_background_colour("#BDB396")
    t.set_title_style("{font-size: 14px; color: #CC2A43;}")
    t.set_body_style("{font-size: 10px; font-weight: bold; color: #000000;}")
    graph.set_tooltip(t)

    render :text => graph.to_s


    
  end


  def module_graph_line
    m = params[:module]
    build = params[:buildid]
    y_axis_length = 0
    report_stat = {:pass => [], :fail => [], :nt => [], :total=>[]}
    

    build_id_list = Result.build_id_list.sort
    b_idx = build_id_list.index(build)+1
    build_id_list = build_id_list.first(b_idx).last(Build_list_length)
    
    
    #    current_build_index = build_id_list.index(build) + 1
    #    start_build = current_build_index >= 18 ? current_build_index - Build_list_length : 0
    #    build_id_list.slice!(start_build, Build_list_length)
    

    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]

    build_id_list.each do |build_id|

      this = Summary.find(:first, :conditions => ["build_id=? and module=?", build_id, m])

      unless this.nil?
        report_stat[:pass].push(this.pass)
        report_stat[:fail].push(this.fail)
        report_stat[:nt].push(this.nt)
        report_stat[:total].push(this.total)

        if this.total > y_axis_length then
          y_axis_length = this.total
        end
      else
        report_stat[:pass].push(0)
        report_stat[:fail].push(0)
        report_stat[:nt].push(0)
        report_stat[:total].push(0)
      end

    end

    y_axis_length = (y_axis_length*1.25).round

    line_dot = LineDot.new
    line_dot.text = "Pass"
    line_dot.width = 1
    line_dot.colour = '#459a89'
    line_dot.dot_size = 2
    line_dot.values = report_stat[:pass]

    line_hollow = LineHollow.new
    line_hollow.text = "Fail"
    line_hollow.width = 1
    line_hollow.colour = '#9a89f9'
    line_hollow.dot_size = 2
    line_hollow.values =  report_stat[:fail]

    line = LineHollow.new
    line.text = "Total"
    line.width = 1
    line.colour = '#5E4725'
    line.dot_size = 2
    line.values =  report_stat[:total]

    y = YAxis.new
    y.set_range(0,20,5)


    # some title
    title = Title.new("IMSx 8.2 VA Test Result of Module {#{m}}", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new

    this_build = Build.find(build)
    this_buildno = this_build.buildno
    buildno_list = Result.buildno_list.sort
    this_buildno_idx = buildno_list.index(this_buildno)+1
    
    
    x_axis.labels = buildno_list.first(this_buildno_idx).last(Build_list_length)

    x_legend = XLegend.new("Build No")
    x_legend.set_style('{font-size: 13px; color: #778877}')

    y_legend = YLegend.new("#Case")
    y_legend.set_style('{font-size: 13px; color: #778877}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffff'
    graph.title = title
    graph.x_axis = x_axis
    graph.y_axis = y_axis
    
    graph.add_element(line_dot)
    graph.add_element(line_hollow)
    graph.add_element(line)

    graph.set_x_legend(x_legend)
    graph.set_y_legend(y_legend)

    # set tooltip
    t = Tooltip.new
    t.set_shadow(false)
    t.stroke = 5
    t.colour = '#6E604F'
    t.set_background_colour("#BDB396")
    t.set_title_style("{font-size: 14px; color: #CC2A43;}")
    t.set_body_style("{font-size: 10px; font-weight: bold; color: #000000;}")
    graph.set_tooltip(t)

    render :text => graph.to_s
    
  end



  def module_graph_stackbar
    m = params[:module]
    y_axis_length = 0
    report_stat = {}

    build_list = Result.build_list

    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]

    build_list.each do |build|

      
      total_cases = Result.find_all_by_module(m, :conditions=>["build_id = ?", build.id], :group=>'defined_id')
      pass_cases = Result.pass_cases(build, m)
      real_fail_cases = Result.real_fail_cases(build_id, m)
      suspicious_cases = Result.suspicious_cases(build_id, m)
      nt_cases = Result.nt_cases(build_id, m)
      

      if total_cases.length > y_axis_length then
        y_axis_length = total_cases.length
      end

      report_stat[build.buildno.to_s] = [
        pass_cases.length,
        real_fail_cases.length,
        nt_cases.length,
      ]

    end

    y_axis_length = (y_axis_length*1.25).round

    bar = BarStack.new

    bar.colours = ["#459a89", "#9a89f9", "#47092E"]

    # append value as: pass, failed, nt
    report_stat.each_value do |value|
      bar.append_value(value)
    end

    # set keys
    key_pass = BarBase.new({:colour=>"#459a89", :text => "PASS", :font_size => 13})
    key_failed = BarBase.new({:colour=>"#9a89f9", :text => "FAIL", :font_size => 13})
    key_nt = BarBase.new({:colour=>"#47092E", :text => "NT", :font_size => 13})

    bar.set_keys([key_pass, key_failed, key_nt])

    # some title
    title = Title.new("IMSx 8.2 VA Test Result of Module {#{m}}", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = report_stat.keys

    x_legend = XLegend.new("Build No")
    x_legend.set_style('{font-size: 13px; color: #FFFAFA}')

    y_legend = YLegend.new("#Case")
    y_legend.set_style('{font-size: 13px; color: #FFFAFA}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffff'
    graph.title = title
    graph.x_axis = x_axis
    graph.y_axis = y_axis
    graph.elements = [bar]
    graph.set_x_legend(x_legend)
    graph.set_y_legend(y_legend)

    # set tooltip
    t = Tooltip.new
    t.set_shadow(false)
    t.stroke = 5
    t.colour = '#6E604F'
    t.set_background_colour("#BDB396")
    t.set_title_style("{font-size: 14px; color: #CC2A43;}")
    t.set_body_style("{font-size: 10px; font-weight: bold; color: #000000;}")
    graph.set_tooltip(t)

    render :text => graph.to_s
  end

  def build_graph_pie
    # based on this example - http://teethgrinder.co.uk/open-flash-chart-2/pie-chart.php

    build_id = params[:id]
    # construction data, - to give a array list
    this = Summary.find(:all, :conditions=>["build_id = ?", build_id])
    values = this.select {|x| x.total != 0}.sort_by{|x| x.total}.collect do |x|
      PieValue.new(x.total, "#{x.module}")

    end
    
    title = Title.new("Automation cases distribution")

    pie = Pie.new
    pie.start_angle = 35
    pie.animate = true
    pie.tooltip = '#val# of #total#<br>#percent# of 100%'
    pie.colours = ["#d01f3c", "#356aa0", "#C79810"]
    #    pie.values  = [2,3, PieValue.new(6.5,"Hello (6.5)")]
    pie.values = values

    chart = OpenFlashChart.new
    chart.title = title
    chart.add_element(pie)

    chart.x_axis = nil

    render :text => chart.to_s

  end


  def build_graph_stackbar

    #    lastest_buildno = get_lastest_buildno

    build_id = params[:id]
    build = Build.find(build_id)
    buildno = build.buildno

    y_axis_length = 0
    report_stat = {}


    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]


    # module list
    modules = get_module_list(build_id)

    modules.sort.each do |m|
      
      this = Summary.find(:first, :conditions => ["build_id=? and module=?", build_id, m])

      if this.total> y_axis_length then
        y_axis_length = this.total
      end

      report_stat[m.to_s] = [this.pass, this.fail, this.nt]
    end
    

    #
    #
    #
    #
    #
    #
    #      total_cases = Result.find_all_by_module(m, :conditions=>["buildno = ?", buildno], :group=>'defined_id')
    #      pass_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'PASS'", buildno], :group=>'defined_id')
    #      overall_fail_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'FAIL'", buildno], :group=>'defined_id')
    #
    #      real_fail_cases = overall_fail_cases.find_all do |obj|
    #        Result.find_all_by_module(m,
    #          :conditions=>["buildno = ? and defined_id = ? and result = 'PASS'", buildno, obj.defined_id]).empty?
    #      end
    #
    #      nt_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'NT'", buildno], :group=>'defined_id')
    #
    #      if total_cases.length > y_axis_length then
    #        y_axis_length = total_cases.length
    #      end
    #
    #      report_stat[m.to_s] = [
    #        pass_cases.length,
    #        real_fail_cases.length,
    #        nt_cases.length,
    #      ]




    # ===== Remove to fix multiple same fail cases * BEGIN ===========
    #    # group by subject and use subject as the key
    #    results.group_by(&:module).each do |tmodule, result|
    #      # 3d bar graph, could be any bar graph though
    #
    #      #      #handle pass
    #      #      module_hash = {
    #      #        :pass => result.select {|x| x.result == 'pass'}.length,
    #      #        :nt => result.select {|x| x.result == 'nt'}.length,
    #      #        :failed => result.select {|x| x.result == 'failed'}.length,
    #      #      }
    #
    #      # total case number for each module
    #      total_case_number  = result.collect { |item| item.defined_id}.uniq.length
    #      total_pass_number = result.select {|x| x.result='PASS'}.collect { |item| item.defined_id}.uniq.length
    #      total_fail_number = total_case_number - total_pass_number
    #
    #
    #      if result.length > y_axis_length then
    #        y_axis_length = result.length
    #      end
    #
    #      report_stat[tmodule.to_s] = [
    #        total_pass_number,
    #        total_fail_number,
    #        result.select {|x| x.result == 'NT'}.length      ]
    #    end
    # ===== Remove to fix multiple same fail cases ** EBD ===========

    #      pass_bar.set
    #      bar.set_key(tmodule, 3)
    #      bar.colour = colours[bars.size]
    #      bar.values = result.length
    #      bars << bar
    #
    #      tmodules << tmodule
    bar = BarStack.new

    bar.colours = ["#459a89", "#9a89f9", "#47092E"]

    # append value as: pass, failed, nt
    report_stat.each_value do |value|

      #      tmp = BarValue.new(5)
      #      tmp.set_colour('#000000')
      #      tmp.set_tooltip("Spoon {#val#}<br>Title Bar 2<br>Override bar 2 tooltip<br>Special data point")

      #      tmp = BarBase.new({:top => 50, :colour => "#ff00ff", :tip=>"oh yeah"})
      #      value << tmp



      bar.append_value(value)


      # make specail tooltip for each "pass", 'failed' and "nt'
      #      value_with_tooltip = value.map {|item| BarValue.new(item).set_tooltip("pass: #val#")}
      #      bar.append_value(value_with_tooltip)
    end




    # set keys
    key_pass = BarBase.new({:colour=>"#459a89", :text => "PASS", :font_size => 13})
    key_failed = BarBase.new({:colour=>"#9a89f9", :text => "FAIL", :font_size => 13})
    key_nt = BarBase.new({:colour=>"#47092E", :text => "NT", :font_size => 13})

    bar.set_keys([key_pass, key_failed, key_nt])

    # some title
    title = Title.new("IMSx 8.2 VA Test Result of Build ##{buildno}", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = report_stat.keys.map{|module_name| module_name[0,Module_name_length]}

    x_legend = XLegend.new("Modules")
    x_legend.set_style('{font-size: 13px; color: #778877}')

    y_legend = YLegend.new("#Case")
    y_legend.set_style('{font-size: 13px; color: #778877}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length*1.1, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffff'
    graph.title = title
    graph.x_axis = x_axis
    graph.y_axis = y_axis
    graph.elements = [bar]
    graph.set_x_legend(x_legend)
    graph.set_y_legend(y_legend)

    # set tooltip
    t = Tooltip.new
    t.set_shadow(false)
    t.stroke = 5
    t.colour = '#6E604F'
    t.set_background_colour("#BDB396")
    t.set_title_style("{font-size: 14px; color: #CC2A43;}")
    t.set_body_style("{font-size: 10px; font-weight: bold; color: #000000;}")
    graph.set_tooltip(t)


    render :text => graph.to_s

  end


  def graph_code_glassbar
    # we will have bars for each student subject combo


    report_stat = {}


    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]

    # the results
    results = Result.find(:all)

    # group by subject and use subject as the key
    results.group_by(&:module).each do |tmodule, result|
      # 3d bar graph, could be any bar graph though

      #      #handle pass
      #      module_hash = {
      #        :pass => result.select {|x| x.result == 'pass'}.length,
      #        :nt => result.select {|x| x.result == 'nt'}.length,
      #        :failed => result.select {|x| x.result == 'failed'}.length,
      #      }

      report_stat[tmodule.to_s] = {
        :pass => result.select {|x| x.result == 'PASS'}.length,
        :nt => result.select {|x| x.result == 'NT'}.length,
        :failed => result.select {|x| x.result == 'FAIL'}.length,
      }
    end


    #      pass_bar.set
    #      bar.set_key(tmodule, 3)
    #      bar.colour = colours[bars.size]
    #      bar.values = result.length
    #      bars << bar
    #
    #      tmodules << tmodule
    pass_bar = BarGlass.new
    pass_bar.append_value(report_stat.values.map{|value| value[:pass]})
    pass_bar.set_key('pass', 10)
    pass_bar.colour = colours[0]

    nt_bar = BarGlass.new
    nt_bar.set_values(report_stat.values.map{|value| value[:nt]})
    nt_bar.set_key('nt', 10)
    nt_bar.colour = colours[1]

    failed_bar = BarGlass.new
    failed_bar.set_values(report_stat.values.map{|value| value[:failed]})
    failed_bar.set_key('fail', 10)
    failed_bar.colour = colours[2]

    # some title
    title = Title.new("Test Results")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = report_stat.keys

    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, 120, 10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffff'
    graph.title = title
    graph.x_axis = x_axis
    graph.y_axis = y_axis
    graph.elements = [pass_bar, failed_bar, nt_bar]

    render :text => graph.to_s
  end
  
  #  def case_list
  #
  #    render :update do |page|
  #      page.replace_html('case_list' )
  #    end
  #
  #
  #  end

  def more_modules
    @modules = Result.module_list

    render :update do |page|
      #      page.visual_effect :fade, 'primaryContent'
      page.replace_html 'primaryContent', :partial => "more_module", :object => @modules
    end
    
  end


  def more
    @build_list = Build.find(:all)
    
    render :update do |page|
      #      page.visual_effect :fade, 'primaryContent'
      page.replace_html 'primaryContent', :partial => "more", :object => @build_list
    end
  end

  def pfc
    @pfcs = Result.find(:all, :conditions => ["pfc = 1"])

    render :update do |page|
      #      page.visual_effect :fade, 'primaryContent'
      page.replace_html 'primaryContent', :partial => "pfc", :object => @pfcs
    end
    
  end

  def send_notification
    #    spawn do
    #      logger.info("I feel sleepy...")
    #      sleep 11
    #      logger.info("Time to wake up!")
    #    end
    #
    #    redirect_to :action => "index"
	
	# only "rick" can send out notification
    if logged_in? and current_user.login == 'rick'
		product_id = 2
	    #Notifier.deliver_daily_report("kevin_young@trendmicro.com.cn",get_lastest_buildno, product_id)
		Notifier.deliver_daily_report("AllofCNIMSXQARegular@dl.trendmicro.com, AllofCNIMSXQAInternTeam@dl.trendmicro.com, tonny_zhu@trendmicro.com.cn, jacky_zhu@trendmicro.com.cn",get_lastest_buildno, product_id)	    
	    return if request.xhr?
	    render :text => 'Message sent successfully'	
	else
		render :text => 'You are not allowed to send notifcation'
	end
    
  end

  private

  # real_fail_cases + suspicious_cases = total_fail_cases

  # what's a real fail cases, it's never been passed
  #  def real_fail_cases(buildno, m)
  #    overall_fail_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'FAIL'", buildno], :group=>'defined_id')
  #    overall_fail_cases.find_all do |obj|
  #      Result.find_all_by_module(m,
  #        :conditions=>["buildno = ? and defined_id = ? and result = 'PASS'", buildno, obj.defined_id]).empty?
  #    end
  #  end
  #
  #  # cases ever passed
  #  def suspicious_cases(buildno, m)
  #    overall_fail_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'FAIL'", buildno], :group=>'defined_id')
  #    overall_fail_cases.reject do |obj|
  #      Result.find_all_by_module(m,
  #        :conditions=>["buildno = ? and defined_id = ? and result = 'PASS'", buildno, obj.defined_id]).empty?
  #    end
  #  end
  #
  #  def nt_cases(buildno, m)
  #    Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'NT'", buildno], :group=>'defined_id')
  #  end
  #
  #
  #
  #  def pass_cases(buildno,m)
  #    Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'PASS'", buildno], :group=>'defined_id')
  #  end
  
  

  def get_lastest_buildno
    return Build.find(:first, :order => "buildno DESC").buildno
  end

  def get_buildnos
    return Build.find(:all,  {:group => "buildno"}).collect { |b| b.buildno }
  end

end

