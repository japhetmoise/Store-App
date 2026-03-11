module Api
  class ProductsController < BaseController
    before_action :set_product, only: %i[show update destroy]

    def index
      render json: Product.order(:product_id)
    end

    def show
      render json: @product
    end

    def create
      product = Product.new(product_params)

      if product.save
        render json: product, status: :created
      else
        render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @product.update(product_params)
        render json: @product
      else
        render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @product.destroy
      head :no_content
    end

    private

    def set_product
      @product = Product.find(params[:product_id])
    end

    def product_params
      params.require(:product).permit(:name, :price)
    end
  end
end
