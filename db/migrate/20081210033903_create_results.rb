class CreateResults < ActiveRecord::Migration
  def self.up
    create_table :results do |t|
      t.column :defined_id, :string, :limit=>32
      t.column :result, :string, :limit=>32
      t.column :build_id, :string, :limit=>32
      t.timestamps
    end
  end

  def self.down
    drop_table :results
  end
end
