module OpenFlashChart

  class BarStack < BarBase
    def initialize args={}
      super
      @type = "bar_stack"      
    end

    def append_key(text, size)
      @keys ||=[]
      @keys << {:text => text, :font_size => size}
    end

    alias_method :append_stack, :append_value


  end

  class BarStackValue < Base
    def initialize(val,colour, args={})
      @val    = val
      @colour = colour
      super
    end
  end

end