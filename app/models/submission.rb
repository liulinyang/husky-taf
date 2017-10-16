class Submission < ActiveRecord::Base
  has_many :results
  belongs_to :build

  attr_accessor :buildno
#  before_save :create_build_if_not_exist

  #  validates_format_of :content_type, :with => /text/,    :message => "--- you can only upload text"

  def result_field=(result_field)
    self.result_file_name = base_part_of(result_field.original_filename)
    self.content_type = result_field.content_type.chomp
    self.data = result_field.read

    logger.info("#{self.data}")
  end
  def base_part_of(file_name)
    File.basename(file_name).gsub(/[^\w._-]/, '' )
  end


#  private
#  def create_build_if_not_exist
#    unless buildno.blank?
#
#      unless Build.detect { |b| b.buildno == buildno }
#        create_build do |b|
#          b.buildno = buildno
#          b.product_id = 2  # right now is "imsx" linux
#        end
#      end # unless build exist
#    end # unless
#  end
  
end
