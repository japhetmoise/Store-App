class StoreIn < ApplicationRecord
  self.table_name = "store_in"

  belongs_to :product, class_name: "Product", foreign_key: "product_id", primary_key: "product_id", inverse_of: :store_ins
end
