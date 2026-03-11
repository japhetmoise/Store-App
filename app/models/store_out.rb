class StoreOut < ApplicationRecord
  self.table_name = "store_out"

  belongs_to :product, class_name: "Product", foreign_key: "product_id", primary_key: "product_id", inverse_of: :store_outs
end
