class Product < ApplicationRecord
  self.table_name = "product"
  self.primary_key = "product_id"

  has_many :store_ins, class_name: "StoreIn", foreign_key: "product_id", primary_key: "product_id", inverse_of: :product
  has_many :store_outs, class_name: "StoreOut", foreign_key: "product_id", primary_key: "product_id", inverse_of: :product
end
