module Api
  class StoreInsController < BaseController
    before_action :set_store_in, only: %i[show update destroy]

    def index
      render json: StoreIn.order(:id)
    end

    def show
      render json: @store_in
    end

    def create
      store_in = StoreIn.new(store_in_params)

      if store_in.save
        render json: store_in, status: :created
      else
        render json: { errors: store_in.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @store_in.update(store_in_params)
        render json: @store_in
      else
        render json: { errors: @store_in.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @store_in.destroy
      head :no_content
    end

    private

    def set_store_in
      @store_in = StoreIn.find(params[:id])
    end

    def store_in_params
      params.require(:store_in).permit(:product_id, :quantity, :date)
    end
  end
end
