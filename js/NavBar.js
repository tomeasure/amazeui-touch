import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import ClassNameMixin from './mixins/ClassNameMixin';
import Icon from './Icon';

import '../scss/components/_navbar.scss';

const NavBar = createReactClass({
  displayName: 'NavBar',
  mixins: [ClassNameMixin],

  propTypes: {
    classPrefix: PropTypes.string,
    amStyle: PropTypes.oneOf([
      'primary',
      'secondary',
      'success',
      'warning',
      'alert',
      'dark',
    ]),
    title: PropTypes.node,
    leftNav: PropTypes.array,
    rightNav: PropTypes.array,
    titleOnLeft: PropTypes.bool,
    onAction: PropTypes.func,
  },

  getDefaultProps() {
    return {
      classPrefix: 'navbar',
      onAction: () => {
      },
    };
  },

  renderTitle() {
    let {
      titleOnLeft,
      title,
    } = this.props;
    let titlePosition = this.prefixClass(titleOnLeft ? 'left' : 'center');

    return title ? (
      <h2
        className={cx(this.prefixClass('title'), titlePosition)}
      >
        {title}
      </h2>
    ) : this.props.children;
  },

  renderNav(position) {
    let nav = this.props[position + 'Nav'];
    this._navPosition = position;

    return nav && Array.isArray(nav) ? (
      <div
        className={cx(this.prefixClass('nav'),
        this.prefixClass(position))}
      >
        {nav.map(this.renderNavItem)}
      </div>
    ) : null;
  },

  renderNavItem(item, index) {
    let {
      component: Component,
      title,
      customIcon,
      icon,
      isClone,
      // href,
      className,
      ...otherProps,
    } = item;
    let children = [];
    let itemClassName = cx(this.prefixClass('nav-item'), className);
    let itemProps = {
      key: 'navbarNavItem' + index,
      onClick: this.props.onAction.bind(this, item),
      ...otherProps,
      className: itemClassName,
    };

    Component = Component || 'a';

    title && children.push(
      <span
        className={this.prefixClass('nav-title')}
        key='title'
      >
        {title}
      </span>
    );

    const navIconKey = 'icon';
    const iconClassName = {
      [this.prefixClass('icon')]: true,
      // affected by order and icon order changing
      // .navbar-nav-title ~ .navbar-icon not works
      // add an className to set styles
      [this.prefixClass('icon-sibling-of-title')]: !!title,
    };
    let navIcon = customIcon ? (
      <img
        src={customIcon}
        className={cx(iconClassName)}
        alt={title || null}
        key={navIconKey}
      />
    ) : icon ? (
      <Icon
        className={cx(iconClassName)}
        name={icon}
        key={navIconKey}
      />
    ) : null;

    // adjust title and icon order for Android UC
    // @see ../scss/helper/_mixins.scss `navbar-item-android-uc-fallback` mixin
    if (navIcon) {
      const action = this._navPosition === 'left' ? 'unshift' : 'push';
      Array.prototype[action].call(children, navIcon);
    }
    // navIcon && children.push(navIcon);

    let renderChildren = () => {
      // #40
      // if `Component` is a clone type like OffCanvasTrigger,
      // this should return a element with the className.
      // TBC: should other props be transferred to the span element?
      return isClone ? (
        <span
          className={itemClassName}
        >
          {children}
        </span>
      ) : children;
    };

    return (
      <Component {...itemProps}>
        {renderChildren()}
      </Component>
    );
  },

  render() {
    let classSet = this.getClassSet();
    let {
      className,
      ...props
    } = this.props;

    delete props.title;
    delete props.classPrefix;
    delete props.leftNav;
    delete props.rightNav;
    delete props.amStyle;
    delete props.onAction;
    delete props.titleOnLeft;

    return (
      <header
        {...props}
        className={cx(classSet, className)}
      >
        {this.renderTitle()}
        {this.renderNav('left')}
        {this.renderNav('right')}
      </header>
    );
  },
});

export default NavBar;
