class DashboardSweeper < ActionController::Caching::Sweeper
  observe Summary
  
  # def after_save(summary)
    # expire_cache_for(summary)
  # end
  
  # def after_destroy(summary)
    # expire_cache_for(summary)
  # end
  
  def after_update(summary)
    expire_cache_for(summary)
  end
  
  private
  def expire_cache_for(summary)
    expire_page(build_status_url(:build_id => summary.build_id))

    expire_page(:controller => 'dash_board', :action => 'trend')
    expire_page(:controller => 'dash_board', :action => 'change')
#    expire_page(:controller => 'public', :action => 'webcomic', :id => (record.id - 1))
  end
end