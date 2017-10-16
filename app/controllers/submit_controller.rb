class SubmitController < ApplicationController
  before_filter :login_required
  
  def get
    @submission = Submission.new
    #    @submissions = Submission.find(:all)

    @submissions = Submission.paginate :per_page => 5, :page=>params[:page],
      :order => 'created_at DESC'
  end


  # Ajax method
  def save
    
    #      if params[:submission][:buildno].blank?
    #        #        flash[:notice] = "Build No cannot be blank."
    #        raise RuntimeError.new("Build No cannot be blank.")
    #
    #
    #      end
    render :update do |page|
      page['overall_notice'].update("Build No cannot be blank.").show
    end

    #      if params[:submission][:result_field].blank?
    #        raise RuntimeError.new("Please specify test result file.")
    #      end
    #
    #      @submission = Submission.new(params[:submission])
    #
    #      # not loaded yet, defaults to '0'
    #      @submission.loaded = 0
    #
    #      if logged_in?
    #        @submission.owner = current_user.login
    #      else
    #        redirect_to :controller=>'account', :action=>'login'
    #      end
    #
    #      @submission.save
    #
    #    rescue Exception => e
    #      flash[:notice] = "#{e}"
    #      render :update do |page|
    #      page['notice'].update("#{e}")
    #    end
    #
    #
    #
    #
    #    end


  end


  # POST method
  def save_html
    begin
      if params[:submission][:buildno].blank?
        #        flash[:notice] = "Build No cannot be blank."
        raise RuntimeError.new("Build No cannot be blank.")
      end

      if params[:submission][:result_field].blank?
        raise RuntimeError.new("Please specify test result file.")
      end

      @submission = Submission.new(params[:submission])

      # not loaded yet, defaults to '0'
      @submission.loaded = 0

      if logged_in?
        @submission.owner = current_user.login
      else
        redirect_to :controller=>'account', :action=>'login'
      end
    
      @submission.save

    rescue Exception => e
      flash[:notice] = "#{e}"
    end

    redirect_to :action=>"get"   
  end


  def show
    @submission = Submission.find(params[:id])
  end

  def submission
    @submission = Submission.find(params[:id])
    #    send_data(@submission.data,
    #      :filename => @submission.result_file_name,
    #      :type => @submission.content_type,
    #      :disposition => "inline" )
  end

  def load_result
    @submission = Submission.find(params[:id])

    # parsing result file and checking result table


    begin
      # checking syntax first.
      @submission.data.each_line do |line|
        unless line =~ /:[pass|failed|nt]/
          raise RuntimeError.new("syntax of line in result file is not right: {#{line}}")
        end
      end

      @submission.data.each_line do | line|
        logger.info("#{line}")

        defined_id, result = line.split(':', 2)

        logger.info("definedid: #{defined_id}")
        logger.info("result: #{result}")
        logger.info("#{@submission.buildno}")
     
        result = Result.new do |r|
          r.defined_id = defined_id
          r.result = result
          r.submission_id = @submission.id
          r.buildno = @submission.buildno
          logger.info("#{@submission.buildno}")
        end

        result.save
        
        # change status to "loaded"
        @submission.update_attribute :loaded, 1
      
      end

    rescue RuntimeError => rt
      logger.info("oops, #{rt}")
      flash[:notice] = "#{rt}"

    rescue Exception => e
      logger.info("oops, #{e}")
      flash[:notice] = "#{e}"
      
    else
      flash[:notice] = "load result file #{@submission.result_file_name} successfully!"
    end

    

    redirect_to :action => "get"
  end
    
    
end
 

