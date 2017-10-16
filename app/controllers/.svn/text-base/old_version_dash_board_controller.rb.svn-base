class DashBoardController < ApplicationController


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


  def index

    @lastest_buildno = get_lastest_buildno
    @buildnos = get_buildnos.reverse
    @modules = Result.module_list
    
    @current_buildno = params[:buildno] || @lastest_buildno
    @current_module = params[:module] || @modules[0]


    @build_graph = open_flash_chart_object(600,300,"/dash_board/build_graph_stackbar?buildno=#{@current_buildno}")

    @build_pie_graph = open_flash_chart_object(600,300,"/dash_board/build_graph_pie?buildno=#{@current_buildno}")
    
    #    @module_graph = open_flash_chart_object(600,300,"/dash_board/module_graph_stackbar?module=#{@current_module}")
    @module_graph = open_flash_chart_object(600,300,"/dash_board/module_graph_line?module=#{@current_module}")
    
    @build_report_stat = {}
    @module_report_stat = {}

    get_module_list(@current_buildno).each do |m|

      this= Summary.find(:first, :conditions=>["build_id=? and module=?", @current_build_id, m])
      #      checked_count = Pfc.find(:all, :conditions=>["build_id=? and module=?", @current_build_id, m]).length
      @build_report_stat[m] = [this.pass, this.fail, this.nt, this.duration]
    end
    
    Result.build_list().each do |build|
      this= Summary.find(:first, :conditions=>["build_id=? and module=?", build.id, @current_module])
      unless this.nil?
        @module_report_stat[build.buildno] = [ this.pass, this.fail, this.nt, this.duration]
      end
    end


    
    
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



  def get_module_list(buildno)
    return Result.find_all_by_buildno(buildno, :group => "module").collect { |r| r.module }
  end


  def module_graph_line
    m = params[:module]
    y_axis_length = 0
    report_stat = {:pass => [], :fail => [], :nt => [], :total=>[]}

    buildnos = Result.buildno_list
	actual_buildnos = Array.new

    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]

    buildnos.each do |buildno|

      this = Summary.find(:first, :conditions => ["buildno=? and module=?", buildno, m])
	  	  
	# 2009-3-3
	  next if this.nil?  # remove those null objective 
	  
	  # 2009-3-3
	  # fix 'WRS' cannot correctly show buildno 
	  actual_buildnos << buildno
		
	  report_stat[:pass].push(this.pass)
	  report_stat[:fail].push(this.fail)
	  report_stat[:nt].push(this.nt)
	  report_stat[:total].push(this.total)


	  if this.total > y_axis_length then
		y_axis_length = this.total
	  end
	  
	  # set x legend
	  
	 

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
    title = Title.new("IMSx7.1 Test Result of Module {#{m}}", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = actual_buildnos

    x_legend = XLegend.new("Build No")
    x_legend.set_style('{font-size: 13px; color: #778877}')

    y_legend = YLegend.new("#Case")
    y_legend.set_style('{font-size: 13px; color: #778877}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffcc'
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

    buildnos = Result.buildno_list

    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]

    buildnos.each do |buildno|

      
      total_cases = Result.find_all_by_module(m, :conditions=>["buildno = ?", buildno], :group=>'defined_id')
      pass_cases = Result.pass_cases(buildno, m)
      real_fail_cases = Result.real_fail_cases(buildno, m)
      suspicious_cases = Result.suspicious_cases(buildno, m)
      nt_cases = Result.nt_cases(buildno, m)
      

      if total_cases.length > y_axis_length then
        y_axis_length = total_cases.length
      end

      report_stat[buildno.to_s] = [
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
    title = Title.new("IMSx7.1 Test Result of Module {#{m}}", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = report_stat.keys

    x_legend = XLegend.new("Build No")
    x_legend.set_style('{font-size: 13px; color: #778877}')

    y_legend = YLegend.new("#Case")
    y_legend.set_style('{font-size: 13px; color: #778877}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffcc'
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

    buildno = params[:buildno]
    # construction data, - to give a array list
    this = Summary.find_all_by_buildno(buildno)
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

    buildno = params[:buildno]
    y_axis_length = 0
    report_stat = {}


    # random colors to chose from
    colours = ["#459a89", "#9a89f9", "#47092E"]


    # module list
    modules = get_module_list(buildno)

    modules.each do |m|
      
      this = Summary.find(:first, :conditions => ["buildno=? and module=?", buildno, m])
	  

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
    title = Title.new("IMSx7.1 Test Result of Build ##{buildno}", :style => "{font-size: 15px; color: #F24062; text-align: center;}")

    # labels along the x axis, just hard code for now, but you would want to dynamically do this
    x_axis = XAxis.new
    x_axis.labels = report_stat.keys

    x_legend = XLegend.new("Modules")
    x_legend.set_style('{font-size: 13px; color: #778877}')

    y_legend = YLegend.new("#Case")
    y_legend.set_style('{font-size: 13px; color: #778877}')


    # go to 100% since we are dealing with test results
    y_axis = YAxis.new
    y_axis.set_range(0, y_axis_length*1.1, y_axis_length/10)

    # setup the graph
    graph = OpenFlashChart.new
    graph.bg_colour = '#ffffcc'
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
    graph.bg_colour = '#ffffcc'
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
    @buildnos = get_buildnos.reverse
    
    render :update do |page|
      #      page.visual_effect :fade, 'primaryContent'
      page.replace_html 'primaryContent', :partial => "more", :object => @buildnos
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
    Notifier.deliver_notify("kevin_young@trendmicro.com.cn", "Test Result for IMSx Build 1110", "Pass ratio: 80%")
    return if request.xhr?
    render :text => 'Message sent successfully'
  end

  private

  # real_fail_cases + suspicious_cases = total_fail_cases

  # what's a real fail cases, it's never been passed
  def real_fail_cases(buildno, m)
    overall_fail_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'FAIL'", buildno], :group=>'defined_id')
    overall_fail_cases.find_all do |obj|
      Result.find_all_by_module(m,
        :conditions=>["buildno = ? and defined_id = ? and result = 'PASS'", buildno, obj.defined_id]).empty?
    end
  end

  # cases ever passed
  def suspicious_cases(buildno, m)
    overall_fail_cases = Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'FAIL'", buildno], :group=>'defined_id')
    overall_fail_cases.reject do |obj|
      Result.find_all_by_module(m,
        :conditions=>["buildno = ? and defined_id = ? and result = 'PASS'", buildno, obj.defined_id]).empty?
    end
  end

  def nt_cases(buildno, m)
    Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'NT'", buildno], :group=>'defined_id')
  end



  def pass_cases(buildno,m)
    Result.find_all_by_module(m, :conditions=>["buildno = ? and result = 'PASS'", buildno], :group=>'defined_id')
  end
  

  def get_lastest_buildno
    return Result.find(:first, :order => "buildno DESC").buildno
  end

  def get_buildnos
    return Result.find(:all,  {:group => "buildno"}).collect { |r| r.buildno }
  end

end

