# comment-run-scripts
Scripts for [comment-run](https://github.com/nwtgck/actions-comment-run) action

## Built scripts
- <https://nwtgck.github.io/comment-run-scripts/hello-world-comment.js>
- <https://nwtgck.github.io/comment-run-scripts/merge-preview.js>
- <https://nwtgck.github.io/comment-run-scripts/update-all-npm-packages.js>

## Usage

````md
@github-actions run

```js
(async () => {
  const url ="https://nwtgck.github.io/comment-run-scripts/hello-world-comment.js";
  const js = await (await fetch(url)).text();
  eval(js);
})();
```
````
