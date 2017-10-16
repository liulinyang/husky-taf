namespace :db do
  desc "Erase and fill database"
  print :environment
  task :populate => :environment do
    require 'populator'

    [Result].each(&:delete_all)

    Result.populate 50 do |result|
#      first = Populator.words(1)
      first = 'Policy'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end

    Result.populate 50 do |result|
#      first = Populator.words(1)
      first = 'Daemon'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end

    Result.populate 80 do |result|
#      first = Populator.words(1)
      first = 'Foxhunter'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end

    Result.populate 120 do |result|
#      first = Populator.words(1)
      first = 'AU'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end

    Result.populate 120 do |result|
#      first = Populator.words(1)
      first = 'PR'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end

    Result.populate 130 do |result|
#      first = Populator.words(1)
      first = 'Mail'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end

    Result.populate 150 do |result|
#      first = Populator.words(1)
      first = 'ERS'
      second = Populator.words(1)

      result.defined_id = "%s-%s" % [first, second]
      result.result = ['pass', 'failed', 'nt']
      result.buildno = 2111
    end
  end
end