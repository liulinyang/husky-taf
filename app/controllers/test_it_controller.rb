class TestItController < ApplicationController
  before_filter :buildno_no_blank, :only => :save
  before_filter :login_required, 
    :except=> ['mark_pass', 'toggle_details', 'query', 'query_result', 'auto_complete_for_result_buildno', 'auto_complete_for_result_module']

  auto_complete_for :result, :buildno, {:group => :buildno}
  auto_complete_for :result, :module, {:group => :module}

  def index    
  end

  def testcase
    result_id = params[:id]
    @result = Result.find(result_id)
    @step_items = Step.find(:all, :conditions => [" result_id = ?", result_id], :order => "step_index")
    get_test_case_history(result_id)
  end
	
	
  def get_test_case_history(result_id)	
    @result = Result.find(result_id)
	
	# get history result
	@history = Result.find(:all, :conditions => ["defined_id = ?", @result.defined_id], :order=>'build_id')
	
	@final_history  = Array.new
    @history.group_by(&:build_id).each  do |id, history|
        #is this case really pass?
		build = Build.find(id)
        @final_history.push( {
			:result_id => history.id,
            :build_id => id,
            :buildno => build.buildno,
            :result => history.select{|x| x.result == "PASS"}.empty? ? "FAIL" : "PASS",
            :history => history.sort_by { |x| x.submission.runtime }
          }
        )
    end	
  end
	
  def more    
		result_id = params[:id]   
		
		get_test_case_history(result_id)
		
		# get history result
		
	
    
	    render :update do |page|
	      #      page.visual_effect :fade, 'primaryContent'
	      page.replace_html 'primaryContent', :partial => "more", :object => @final_history
	    end
  end
	
	  
  
  def get_buildnos
    return Build.find(:all,  {:group => "buildno"}).collect { |b| b.buildno }
  end


  def mark_pass
    # update the case, make it 'pass' and set 'pfc' true
    c = Result.find(params[:id])
    c.update_attributes :pfc=>1, :result=>'PASS'
      
    render :update do |page|
      #      page.replace_html "#{dom_id(c)}_result", :partial => "result_item", :object => c
      page.replace_html "#{dom_id(c)}_result", 'PASS'
      page.visual_effect :highlight, "#{dom_id(c)}_result"

      page.replace_html "#{dom_id(c)}_pfc", 'Yes'
      page.visual_effect :highlight, "#{dom_id(c)}_pfc"
    end
  end


  
  def query

    unless params[:result].nil?

      build_id = params[:result][:build_id]
      mod = params[:result][:module]
      only = params[:only]

      build = Build.find(build_id)
      buildno = build.buildno

      logger.info("build_no: #{build.buildno}")

      unless only.nil?
        if mod.nil?
          @query_result = Result.find(:all, :conditions => ["build_id = ? and result = ?", build.id, only], :order=>'defined_id')
        else
          @query_result = Result.find(:all, :conditions => ["build_id = ? and result = ? and module = ?",build.id, only, mod], :order=>'defined_id')
        end
      else
        if mod.nil?
          @query_result = Result.find(:all, :conditions=>["build_id = ? ", build.id], :order=>'result')
        else
          @query_result = Result.find(:all, :conditions => ["build_id = ? and module = ? ",build.id, mod],:order=>'result')
        end
      end

      @final_result  = Array.new
      @query_result.group_by(&:defined_id).each  do |id, history|
        #is this case really pass?
        @final_result.push( {
            :defined_id => id,
            :buildno => buildno,
            :result => history.select{|x| x.result == "PASS"}.empty? ? "FAIL" : "PASS",
            :history => history.sort_by { |x| x.submission.runtime }
          }
        )
      end

      # SORTING
      @final_result = @final_result.sort_by {|x| x[:result]}

#      # sorting, so let "Fail" result goes first.
#      fail_count = @final_result.select{ |x| x[:result] == "FAIL"}.length
#
#
#      @fail_first_result = @final_result.sort_by {|x| x[:result] }
#
#
#      @final_result = @fail_first_result.slice!(0, fail_count-1)
#      @final_result += @fail_first_result.sort_by {|x| x[:defined_id]}


      
      



      #      @query_result = Result.find_all_by_buildno(buildno, :conditions => ["result = ?", only], :order=>'result')
    end    
  end


  def new_submission
    @submission = submission.new
  end


  def save_submission

    if request.post?
      @errors = []

      if params[:result][:buildno].blank?
        logger.info("build id null")
        @errors << "build id missing"
      else
      


        filename = params[:result][:uploaded_result].original_filename
        buildno = params[:result][:buildno]
        logger.info("filename: #{filename}")
        logger.info("build id: #{buildno}")

        #    logger.info(params[:result][:uploaded_result].read)

        params[:result][:uploaded_result].each_line do |line|
          logger.info("#{line}")

          defined_id, result = line.split(':', 2)

          result = Result.new do |r|
            r.defined_id = defined_id
            r.result = result
            r.buildno = buildno unless buildno.nil?
          end

          result.save

        end
      end
      redirect_to(:action => 'index' )
    end
    
  end


  protected
  def buildno_no_blank
    if params[:result][:buildno].blank?
      flash[:error] = "build id missing"
      redirect_to :action => :index
    end
  end

  

end
