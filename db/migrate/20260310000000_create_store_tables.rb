class CreateStoreTables < ActiveRecord::Migration[8.1]
  def change
    create_table :product, primary_key: :product_id do |t|
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
    end

    create_table :store_in do |t|
      t.integer :product_id, null: false
      t.integer :quantity, null: false
      t.date :date, null: false
    end

    add_foreign_key :store_in, :product, column: :product_id, primary_key: :product_id
    add_index :store_in, :product_id

    create_table :store_out do |t|
      t.integer :product_id, null: false
      t.integer :quantity, null: false
      t.date :date, null: false
    end

    add_foreign_key :store_out, :product, column: :product_id, primary_key: :product_id
    add_index :store_out, :product_id
  end
end
