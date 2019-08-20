import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { dateNode } from 'discourse/helpers/node';

createWidget('sidebar-activity-item', {
  tagName: 'div.sidebar-activity-item',

  html(attrs) {
    var url = Discourse.getURL("/t/") + attrs.slug + "/" + attrs.id + "/" + attrs.last_read_post_number;

    const lastPostedAt = new Date(attrs.last_posted_at);
	
    attrs.latest_poster.user_id = attrs.latest_poster.id;

    return [
      h('span.avatar', this.attach('post-avatar', attrs.latest_poster)),
      h('span.reply-date', {}, dateNode(lastPostedAt)),
      h('a.item-title', {
        attributes: { href: url}
      }, attrs.title)
    ]
  },
});
