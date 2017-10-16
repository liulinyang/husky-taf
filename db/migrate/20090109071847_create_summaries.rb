class CreateSummaries < ActiveRecord::Migration
  
  def self.up
    create_table :summaries do |t|
      t.column :buildno, :string, :limit=>32
      t.column :module, :string, :limit=>128
      t.column :total, :integer
      t.column :pass, :integer
      t.column :fail, :integer
      t.column :nt, :integer
      t.column :comments, :string, :limit=>2048
      t.timestamps
    end
  end
  

  def self.down
    drop_table :summaries
  end
end
