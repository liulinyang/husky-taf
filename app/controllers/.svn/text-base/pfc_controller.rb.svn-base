class PfcController < ApplicationController
  auto_complete_for :result, :buildno, {:group => :buildno}
  auto_complete_for :result, :module, {:group => :module}
  auto_complete_for :result, :defined_id, {:group => :defined_id}
  in_place_edit_for :pfc, :comments
  in_place_edit_for :pfc, :tracker
  in_place_edit_for :pfc, :status
  in_place_edit_for :pfc, :reason

  #  before_filter :login_required

#  def new
#    render :patial=>"add_pfc"
#    return
#  end

  def index
    @pfcs = Pfc.find(:all)
    
  end


  def handle
    @result = Result.find(params[:id])
  end


  def delete
    this = Pfc.find(params[:id])

    logger.debug("delete pfc: #{this}")

    total = Pfc.find(:all).length

    render :update do |page|
      page[dom_id(this.result)].fade
      page.replace_html :pfc_total_span, "#{total-1}"
      page[:pfc_total_span].highlight
    end

    this.destroy
  end


  def save

    # record with same "buildno+defined_id" or "result_id" should be unique, we need to check
    pfc = Pfc.find(:first, :conditions=>["result_id= ?", params[:pfc][:result_id]] )

    logger.info(pfc)
    logger.info(params)

    unless pfc.nil?
      pfc.update_attributes(params[:pfc])
      flash[:info] = "Process Ticket for {#{pfc.result.testbuild.buildno}:#{pfc.result.defined_id}} updated successfully!"
      redirect_to :action=>:index
      return
      #      render :text=>"the record #{result.defined_id} and #{result.buildno}already exists!"
      #      return render :action=>:index
    end

    result_case = Result.find(params[:pfc][:result_id])
    pfc = result_case.create_pfc(params[:pfc])
#    pfc.build_id = pfc.result.build.id
    #    @pfc = Pfc.new(prarms[:pfc])
#    pfc.save

    flash[:info] = "Process Ticket for {#{pfc.result.testbuild.buildno}:#{pfc.result.defined_id}} created successfully!"

    redirect_to :action=>:index
  end
end
  

def ajax_save
  render :update do |page|
    #      page.insert_html :after, "pfc_list_header", "<tr><td>hoho</td><td>hoho</td></tr>"
    page.insert_html :after, "pfc_list_header", :partial => 'pfc_item', :object => pfc
    page.visual_effect :highlight, "#{dom_id(pfc)}"

  end    
end









