class CreateProducts < ActiveRecord::Migration
  def self.up
    create_table :products do |t|
      t.column :name, :string, :limit=>32  # maybe "IMSx", "SMex"...
      t.column :version, :string, :limit=>32  # "5.1" or "7.1"
      t.column :platform, :string, :limit=>128 # "Appliance", "Linux"...
      t.column :comments, :string, :limit=>128 # Anything related
      t.timestamps
    end
  end

  def self.down
    drop_table :products
  end
end
