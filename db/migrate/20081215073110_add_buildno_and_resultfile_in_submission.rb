class AddBuildnoAndResultfileInSubmission < ActiveRecord::Migration
  def self.up
    add_column :submissions, :buildno, :string
    add_column :submissions, :comments, :string
    add_column :submissions, :result_file_name, :string
    add_column :submissions, :data, :binary, :limit => 1.megabyte
  end

  def self.down
  end
end
