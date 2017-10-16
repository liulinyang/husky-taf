class CreateSubmissions < ActiveRecord::Migration
  def self.up
    create_table :submissions do |t|
      t.column :owner, :string

      

      t.timestamps
    end
  end

  def self.down
    drop_table :submissions
  end
end
