class AnalysisController < ApplicationController

  def top_keyword
    #  @tops = Step.find(:all, :order=>"duration DESC", :limit=>10)
    @tops = Step.find(:first)
  end

  def step_duration
    Step.find
  end

  def analysis
    #  sql = params[:id]
    sql = "select sum(duration)/3600 as total_duration, count(*) as ref_count, sum(duration)/count(*) as average, kmodule, keyword, param from steps group by kmodule, keyword order by total_duration DESC limit 0,20"
    @keyword_stat = Step.find_by_sql(sql)
#    logger.debug "#{Step.find_by_sql(sql).first(2)} ssss"

#    logger.debug "The object is #{@output.length}"

  end
  
end
