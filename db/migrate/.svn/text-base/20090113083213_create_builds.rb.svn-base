class CreateBuilds < ActiveRecord::Migration
  def self.up
    create_table :builds do |t|
      t.column :buildno, :string, :limit=>32
      t.column :product_id, :string
      t.column :type, :string  # type supports: "automation", "dailybuild", "manual_build"
      t.column :health, :string  # "good" or "bad" or "medium", which we could define rules for it
      t.column :comments, :string, :limit=>2048
      t.timestamps
    end
  end

  def self.down
    drop_table :builds
  end
end
