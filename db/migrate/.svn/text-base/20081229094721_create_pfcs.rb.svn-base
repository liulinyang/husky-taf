class CreatePfcs < ActiveRecord::Migration
  def self.up
    create_table :pfcs do |t|
      t.column :defined_id, :string, :limit=>255
      t.column :module, :string, :limit=>128
      t.column :owner, :string, :limit=>255
      t.column :status, :string, :limit=>255
      t.column :reason, :string, :limit=>255
      t.column :comments, :string, :limit=>2048
      t.column :build_id, :string, :limit=>32
      t.timestamps
    end
  end

  def self.down
    drop_table :pfcs
  end
end
