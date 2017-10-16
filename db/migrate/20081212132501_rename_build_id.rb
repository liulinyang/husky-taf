class RenameBuildId < ActiveRecord::Migration
  def self.up
    rename_column :results, :build_id, :buildno
  end

  def self.down
    rename_column :results, :buildno, :build_id
  end
  
end
