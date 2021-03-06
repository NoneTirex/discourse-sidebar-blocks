import { createWidget } from 'discourse/widgets/widget';
import { getLatestActivity } from 'discourse/plugins/discourse-sidebar-blocks/discourse/helpers/recent-activity';
import { h } from 'virtual-dom';

export default createWidget('sidebar-latest-activity', {
  tagName: 'div.sidebar-latest-activity',
  buildKey: attrs => 'sidebar-latest-activity',
  defaultState() {
    return { loading: false };
  },

  refreshPosts() {
    if (this.state.loading) { return; }
    this.state.loading = true
    this.state.posts = 'empty'
    getLatestActivity(this).then((result) => {
      var users = result.users;
	  var topics = result.topic_list.topics;
      if (topics.length) {
	    var posts = [];
		for (var i = 0; i < topics.length && i < parseInt(this.siteSettings.sidebar_topic_count); i++)
		{
		  var post = topics[i];
		  post.latest_poster = this.findLatestPoster(post.posters, users);
		  posts[i] = post;
		}
        this.state.posts = posts;
      }
      this.state.loading = false
      this.scheduleRerender()
    })
  },
  findUser(id, users) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          return users[i];
        }
    }
    return null;
  },
  findLatestPoster(posters, users) {
    for (var i = 0; i < posters.length; i++)
	{
	  var poster = posters[i];
          if (poster.extras !== null && poster.extras.indexOf("latest") >= 0)
	  {
            var user = this.findUser(poster.user_id, users);
            user.user_id = user.id;
	    return user;
	  }
	}
	return null;
  },
  html(attrs, state) {
    const messageBus = Discourse.__container__.lookup('message-bus:main')
    messageBus.subscribe("/latest", data => {
      this.refreshPosts();
    });

    if (!state.posts) {
      this.refreshPosts();
    }
    const result = [];
    if (state.loading) {
      result.push(h('div.spinner-container', h('div.spinner')));
    } else if (state.posts !== 'empty') {
      result.push(h('h3.sidebar-heading', I18n.t('sidebar_blocks.recent_activity.title')));
      const replies = state.posts.map(t => this.attach('sidebar-activity-item', t));
      result.push(replies);
    } else {
      result.push(h('div.no-messages', I18n.t('sidebar_blocks.recent_activity.empty')))
    }

    return result;
  },

});
