/*
 * Description of what this file is for
 *
 * @package Baukasten
 * @author David Hellmann [david@hellmann.io]
 * gridOverlay
 */

import initComponent from '../../../src/js/utils/initComponent'

const gridOverlay = {
  cfg: {
    name: 'GridOverlay',
    selectors: {
      toggleGrid: '.js-toggleGrid',
      gridOverlay: '.gridOverlay',
    },
    el: {
      $toggleGrid: undefined,
      $gridOverlay: undefined,
    },
  },

  setElements() {
    // eslint-disable-line
    this.cfg.el.$toggleGrid = document.querySelector(
      this.cfg.selectors.toggleGrid,
    );
    this.cfg.el.$gridOverlay = document.querySelector(
      this.cfg.selectors.gridOverlay,
    );
  },

  toggleGrid() {
    if (this.cfg.el.$gridOverlay) {
      this.cfg.el.$gridOverlay.classList.toggle('is-visible');

      let gridVisible = false;
      if (this.cfg.el.$gridOverlay.classList.contains('is-visible')) {
        gridVisible = true;
      } else {
        gridVisible = false;
      }
      localStorage.setItem('gridVisible', gridVisible);
    }
  },

  init() {
    setTimeout(() => {
      initComponent(this.cfg.name);
      this.setElements();

      // Show grid when in true in local storage
      if (
        this.cfg.el.$gridOverlay &&
        localStorage.getItem('gridVisible') === 'true'
      ) {
        this.cfg.el.$gridOverlay.classList.add('is-visible');
      }

      // Toggle Grid
      if (this.cfg.el.$toggleGrid) {
        this.cfg.el.$toggleGrid.addEventListener(
          'click',
          () => {
            this.toggleGrid();
          },
          false,
        );
      }
    }, 500);
  },
};

export default gridOverlay;
