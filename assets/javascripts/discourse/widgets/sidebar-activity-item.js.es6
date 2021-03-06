import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { dateNode } from 'discourse/helpers/node';
import getURL from 'discourse-common/lib/get-url';

createWidget('sidebar-activity-item', {
  tagName: 'div.sidebar-reply-item',

  html(attrs) {
    var url = getURL("/t/") + attrs.slug + "/" + attrs.id;
    if (attrs.last_read_post_number)
    {
        url += "/" + attrs.last_read_post_number;
    }

    const lastPostedAt = new Date(attrs.last_posted_at);

    return [
      h('span.avatar', this.attach('post-avatar', attrs.latest_poster)),
      h('span.reply-date', {}, dateNode(lastPostedAt)),
      h('a.item-title', {
        attributes: { href: url}
      }, attrs.title)
    ]
  },
});
