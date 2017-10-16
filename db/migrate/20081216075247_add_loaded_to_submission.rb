class AddLoadedToSubmission < ActiveRecord::Migration
  def self.up
    add_column :submissions, :loaded, :integer
  end

  def self.down
  end
end
