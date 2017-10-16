class Tcmt < ActiveRecord::Base

  def Tcmt.testsuites
    Tcmt.find(:all, :group=>'module').select{|x| not x.module=~/_/}.collect {|x| x.module}
  end
end
