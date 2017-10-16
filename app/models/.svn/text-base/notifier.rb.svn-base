class Notifier < ActionMailer::Base
  def daily_report(recipient, buildno, product_id, sent_at = Time.now)
    # try to get lastest buildno for IMSX
    product_id = 2    
    build = Build.find(:first, :conditions => ["buildno = ? and product_id = ?" , buildno, product_id])
    summaries = Summary.find(:all, :conditions=>["build_id=?", build.id])
	
	
	total_pass = summaries.inject(0) {|sum, x| sum = sum + x[:pass]} 
    total_fail = summaries.inject(0) {|sum, x| sum = sum + x[:fail]}
    total_nt = summaries.inject(0) {|sum, x| sum = sum + x[:nt]}          
    total_case = total_pass + total_fail+ total_nt      
          
    #pass_rate = number_to_percentage(total_pass/total_case.to_f * 100, :precision => 0)		
	pass_rate = "%.1f"%(total_pass.to_f/total_case.to_f * 100)		

    subject = "[Husky] IMSX8.2 VA daily build report: #{buildno}, Pass-Rate: #{pass_rate}%"

    @subject = subject
    @recipients = recipient
    @from = 'Husky'
    @sent_on = sent_at
	  @body["title"] = subject   #  'Test Result for IMSx build 1101'
    @body["email"] = 'husky@trendmicro.com.cn'
    @body["summaries"] = summaries
    @content_type = "text/html"
#    @body["message"] = message
#    @headers = {}


  end



  def notify(recipient, subject, message, sent_at = Time.now)
    @subject = subject
    @recipients = recipient
    @from = 'Husky'
    @sent_on = sent_at
	  @body["title"] = 'Test Result for IMSVA5.1 build 1101'
    @body["email"] = 'husky@trendmicro.com.cn'
    @body["message"] = message
    @headers = {}
  end
end
