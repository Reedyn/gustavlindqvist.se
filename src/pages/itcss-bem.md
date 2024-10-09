---
id: 5e5381ab5c2079003879861c
title: "ITCSS + BEM"
feature_image:
description: "Number in front of names to get correct alphabetical sorting and to visualize the inverted triangle."
date: 2020-02-24
permalink: /itcss-bem/
eleventyExcludeFromCollections: true
---

My flavour of IT CSS{.lead}

## Folder structure

Number in front of names to get correct alphabetical sorting.

```
1.settings
2.tools
3.generic
4.elements
5.objects
6.components
7.overrides
main.scss
```

### 1. Settings

used with preprocessors and contain font, colors definitions, etc

### 2. Tools

Mixins, functions using the the preprocessor.

### 3. Generic

Resets, Normalize, generic styling for `<html>` & `<body>` for example.

### 4. Elements

Styling for bare HTML elements such as `<ul>`, `<li>` `<h1>`, `<a>`, `<p>` etc.

### 5. Objects

Generic reusable objects that work as structural elements.
For example a layout grid, wrapper elements, responsive media containers. Shouldn't contain styling in terms of colors, sizing but only the structure/layout required.

### 6. Components

Everything else decoupled into self contained components.

### 7. Overrides

Utilities, helpers and hacks that need to override anything else. For when code don't fit into a component, need to override other styles or when a temporary hack is needed. This is where it goes. For example helpers for hide/show element (`display: none`).

## File naming

File names are all lower-case like in BEM.

`type-name__block-name__element-name`

Depending on how much is included in each individual file parts the `type-name` and/or the `element-name` can be omitted.

For example a file containing all elements of a block would have a name like `type-name__block-name`.

The `type-name` is used for grouping similar elements. For example it can be `layout` when used for the overall layout of the site or `header` when used for the header.

Examples:

-   `header__navigation__menu` (Type - Block - Element)
-   `header__site-logo` (Type - Block)
-   `footer__widgets` (Type - Block)
-   `footer__widgets__location-map` (Type - Block - Element)
-   `buttons` (Block)

## Variable naming

## BEM (My bastardization)

Largely based on [ABEM](https://css-tricks.com/abem-useful-adaptation-bem/)

Objects: `Object-name`

Components: `block-name__element-name -modifier -modifier2`

Main difference from BEM is objects start with a capital letter. Modifiers are separate classes with hypen-prefix to allow inheritance. Only one level of this type of nesting allowed.

Example SCSS:

```scss
.block-name {
	&__element-name {
		// styling for element
		&.-modifier-1 {
			// styling for modifier 1
		}
		&.-modifier-2 {
			// styling for modifier 2
		}
	}
}
```

This will give us the following CSS:

```css
.block-name__element-name {
	/* Styling for element */
}
.block-name__element-name.-modifier-1 {
	/* Styling for modifier 1 */
}
.block-name__element-name.-modifier-2 {
	/* Styling for modifier 2 */
}
```

And in our HTML it will look something like this:

```html
<div class="block-name__element-name -modifier-1 -modifier-2"></div>
```

Much cleaner than standard BEM which can give absurdly long class attribute values. Such as:

```html
<div
	class="block-name__element-name block-name__element-name-modifier-1 block-name__element-name-modifier-2"
></div>
```
