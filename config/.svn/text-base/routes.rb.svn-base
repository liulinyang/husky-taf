ActionController::Routing::Routes.draw do |map|
  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller
  
  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing the them or commenting them out if you're using named routes and resources.
  map.root :controller => 'dash_board', :action => 'build_status'
  map.connect "dashboard/more", :controller=>"dash_board", :action=>"more"
  map.connect "dashboard/more", :controller=>"dash_board", :action=>"more"
  map.connect "dashboard/toggle_details", :controller=>"dash_board", :action=>"toggle_details"
  map.connect "dashboard/pfc", :controller=>"dash_board", :action=>"pfc"
  map.build_status "dashboard/show/build/:build_id", :controller=>"dash_board", :action=>"build_status",:requirements => {
    :build_id => /\d+/,
  }
  map.smoke_status "dashboard/show/smoke/:build_id", :controller=>"dash_board", :action=>"smoke_status",:requirements => {
    :build_id => /\d+/,
  }

  map.module_status "dashboard/show/module/:module", :controller=>"dash_board", :action=>"module_status",:requirements => {
    :module => /\w+/,
  }
  map.showbuild "dashboard/show/:build_id", :controller=>"dash_board", :action=>"index",:requirements => {
    :build_id => /\d+/,
  }
  map.showmodule "dashboard/show/:module", :controller=>"dash_board", :action=>"index",:requirements => {
    :module => /\w+/,
  }

  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'

end
