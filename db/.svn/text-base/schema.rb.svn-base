# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20090113121745) do

  create_table "build_comments", :force => true do |t|
    t.integer  "build_id"
    t.string   "comments",   :limit => 1024
    t.string   "user"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "builds", :force => true do |t|
    t.string   "buildno",    :limit => 32
    t.string   "product_id"
    t.string   "build_type"
    t.string   "health"
    t.string   "notes",      :limit => 2048
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.integer  "build_id"
    t.string   "content",    :limit => 1024
    t.string   "user"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "buildno"
  end

  create_table "pfcs", :force => true do |t|
    t.string   "owner"
    t.string   "status"
    t.string   "reason"
    t.string   "comments",   :limit => 2048
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "result_id"
    t.string   "tracker"
  end

  create_table "products", :force => true do |t|
    t.string   "name",       :limit => 32
    t.string   "version",    :limit => 32
    t.string   "platform",   :limit => 128
    t.string   "comments",   :limit => 128
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "results", :force => true do |t|
    t.string   "defined_id"
    t.string   "result",        :limit => 32
    t.string   "build_id",      :limit => 32
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "submission_id"
    t.string   "module"
    t.boolean  "pfc",                         :default => false
    t.string   "final_result",  :limit => 32
    t.integer  "duration",                    :default => 0
  end

  add_index "results", ["submission_id"], :name => "FK_results"

  create_table "steps", :force => true do |t|
    t.integer  "result_id"
    t.string   "kmodule"
    t.string   "keyword"
    t.integer  "result",     :default => 0, :null => false
    t.string   "comments"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "param"
    t.integer  "step_index",                :null => false
    t.integer  "duration",   :default => 0
  end

  create_table "submissions", :force => true do |t|
    t.string   "owner"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "build_id"
    t.string   "comments"
    t.string   "result_file_name"
    t.binary   "data",             :limit => 16777215
    t.string   "content_type"
    t.integer  "loaded"
    t.datetime "runtime"
  end

  create_table "summaries", :force => true do |t|
    t.string   "build_id",   :limit => 32
    t.string   "module",     :limit => 128
    t.integer  "total"
    t.integer  "pass"
    t.integer  "fail"
    t.integer  "nt"
    t.string   "comments",   :limit => 2048
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "duration",                   :default => 0
  end

  create_table "users", :force => true do |t|
    t.string   "login"
    t.string   "email"
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.datetime "remember_token_expires_at"
  end

end
