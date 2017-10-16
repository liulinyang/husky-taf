namespace :smoke do

  desc "operates on Smoke Test Excel"
  require 'roo'

  def load_excel(xls)
    puts "Load #{xls}..."
    oo = Excel.new(xls)
    oo.default_sheet = oo.sheets.first
    puts oo.sheets
    puts "last row: #{oo.last_row}"
    puts "first row: #{oo.first_row}"
    
    
    2.upto(oo.last_row) do |line|

      defined_id = oo.cell(line, 'A')
      owner = oo.cell(line, 'B')

      puts "#{defined_id} --> #{owner}"
        
      Smoke.create do |s|
        s.defined_id = defined_id
        s.owner = owner
        s.enable = 1
      end

    end
  end
    


  task :smoke => :environment do
    desc "load cases from Smoke Test Case Excel file into DB"

    #    xls = "#{RAILS_ROOT}/tcmt/test.xls"
    xls = "#{RAILS_ROOT}/data/smoke_test_case.xls"
    
    load_excel(xls)
  end

  task :clear => :environment do
    desc "clear Smoke test case in DB"
    Smoke.delete_all
  end
  
end
  
