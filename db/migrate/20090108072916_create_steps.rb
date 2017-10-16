class CreateSteps < ActiveRecord::Migration
  def self.up
    create_table :steps do |t|
      t.column :result_id, :integer
      t.column :kmodule, :string
      t.column :keyword, :string
      t.column :result, :string
      t.column :comments, :string
      t.timestamps
    end
  end

  def self.down
    drop_table :steps
  end
end
