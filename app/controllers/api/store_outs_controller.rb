module Api
  class StoreOutsController < BaseController
    before_action :set_store_out, only: %i[show update destroy]

    def index
      render json: StoreOut.order(:id)
    end

    def show
      render json: @store_out
    end

    def create
      store_out = StoreOut.new(store_out_params)

      if store_out.save
        render json: store_out, status: :created
      else
        render json: { errors: store_out.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @store_out.update(store_out_params)
        render json: @store_out
      else
        render json: { errors: @store_out.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @store_out.destroy
      head :no_content
    end

    private

    def set_store_out
      @store_out = StoreOut.find(params[:id])
    end

    def store_out_params
      params.require(:store_out).permit(:product_id, :quantity, :date)
    end
  end
end
