class CreateBuildComments < ActiveRecord::Migration
  def self.up
    create_table :build_comments do |t|
      t.column :build_id, :integer
      t.column :comments, :string, :limit=>1024
      t.column :user, :string
      t.timestamps
    end
  end

  def self.down
    drop_table :build_comments
  end
end
