# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def in_place_select_editor_field(object, method, tag_options = {},
      in_place_editor_options = {})
    tag = ::ActionView::Helpers::InstanceTag.new(object, method, self)
    tag_options = { :tag => "span" ,
      :id => "#{object}_#{method}_#{tag.object.id}_in_place_editor" ,
      :class => "in_place_editor_field" }.merge!(tag_options)
    in_place_editor_options[:url] =
      in_place_editor_options[:url] ||
      url_for({ :action => "set_#{object}_#{method}" , :id => tag.object.id })
    tag.to_content_tag(tag_options.delete(:tag), tag_options) +
      in_place_select_editor(tag_options[:id], in_place_editor_options)
  end
  def in_place_select_editor(field_id, options = {})
    function = "new Ajax.InPlaceSelectEditor("
    function << "'#{field_id}', "
    function << "'#{url_for(options[:url])}'"
    function << (', ' + options_for_javascript(
        {
          'selectOptionsHTML' =>
            %('#{escape_javascript(options[:select_options].gsub(/\n/, ""))}' )
        }
      )
    ) if options[:select_options]
    function << ')'
    javascript_tag(function)
  end

  def time_ago_or_time_stamp(from_time, to_time = Time.now, include_seconds = true, detail = false)
    from_time = from_time.to_time if from_time.respond_to?(:to_time)
    to_time = to_time.to_time if to_time.respond_to?(:to_time)
    distance_in_minutes = (((to_time - from_time).abs)/60).round
    distance_in_seconds = ((to_time - from_time).abs).round
    case distance_in_minutes
    when 0..1           then time = (distance_in_seconds < 60) ? "#{distance_in_seconds} seconds ago" : '1 minute ago'
    when 2..59          then time = "#{distance_in_minutes} minutes ago"
    when 60..90         then time = "1 hour ago"
    when 90..1440       then time = "#{(distance_in_minutes.to_f / 60.0).round} hours ago"
    when 1440..2160     then time = '1 day ago' # 1-1.5 days
    when 2160..2880     then time = "#{(distance_in_minutes.to_f / 1440.0).round} days ago" # 1.5-2 days
    else time = from_time.strftime("%a, %d %b %Y")
    end
    return time_stamp(from_time) if (detail && distance_in_minutes > 2880)
    return time
  end

  def seconds_to_minutes(seconds)
    "%.1f" % (seconds.to_f/60.to_f)
  end

  def seconds_to_hours(seconds)
    "%.1f" % (seconds.to_f/3600.to_f)
  end



end
