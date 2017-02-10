/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

import SubnetworksListVue from 'components/subnetworks/SubnetworksListVue.html';
import SubnetworkEditor from 'components/subnetworks/SubnetworkEditor'; //eslint-disable-line
import { SubnetworksActions } from 'actions/Actions';

export default Vue.component('subnetworks-list', {
  template: SubnetworksListVue,
  props: {
    model: {
      required: true,
      type: Object
    }
  },
  data() {
    let sortOrders = {
      name: 1,
      cidr: 1
    };
    return {
      deleteConfirmationItem: null,
      sortKey: '',
      sortOrders: sortOrders
    };
  },
  computed: {
    itemsCount() {
      let items = this.model.items;
      return items ? Object.keys(items).length : 0;
    },
    isDeleteConfirmationLoading() {
      return this.model.deleteConfirmationLoading;
    }
  },
  methods: {
    isHighlightedItem(item) {
      return this.isNewItem(item) || this.isUpdatedItem(item);
    },
    isNewItem(item) {
      return item === this.model.newItem;
    },
    isUpdatedItem(item) {
      return item === this.model.updatedItem;
    },
    isEditingItem(item) {
      let editingItem = this.model.editingItemData && this.model.editingItemData.item;
      return editingItem && editingItem.documentSelfLink === item.documentSelfLink;
    },
    isEditingNewItem() {
      let editingItem = this.model.editingItemData && this.model.editingItemData.item;
      return editingItem && !editingItem.documentSelfLink;
    },
    isEditingOrHighlightedItem(item) {
      return this.isEditingItem(item) || this.isHighlightedItem(item);
    },
    isDeleting(item) {
      return this.deleteConfirmationItem === item;
    },
    addNewItem($event) {
      $event.stopImmediatePropagation();
      $event.preventDefault();
      SubnetworksActions.editSubnetwork({});
    },
    editItem(item, $event) {
      $event.stopImmediatePropagation();
      $event.preventDefault();
      SubnetworksActions.editSubnetwork(item);
    },
    confirmDelete(item, $event) {
      $event.stopImmediatePropagation();
      $event.preventDefault();
      this.deleteConfirmationItem = item;
    },
    cancelDelete($event) {
      $event.stopImmediatePropagation();
      $event.preventDefault();
      this.deleteConfirmationItem = null;
    },
    deleteItem($event) {
      $event.stopImmediatePropagation();
      $event.preventDefault();
      SubnetworksActions.deleteSubnetwork(this.deleteConfirmationItem);
    },
    sortBy(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    refresh() {
      SubnetworksActions.retrieveSubnetworks(this.model.endpointLink);
    }
  },
  filters: {
    orderBy(items, sortKey, reverse) {
      if (!sortKey) {
        return items;
      }
      let order = reverse && reverse < 0 ? -1 : 1;
      return items.asMutable().sort((a, b) => {
        a = a[sortKey];
        b = b[sortKey];

        if (!a) {
          a = '';
        }
        if (!b) {
          b = '';
        }
        return a.toLowerCase().localeCompare(b.toLowerCase()) * order;
      });
    }
  }
});
