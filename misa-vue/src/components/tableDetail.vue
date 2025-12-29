<script setup>
import { computed, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import Search from '@/components/searchBar.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  selectedIds: {
    type: Object,
    default: () => new Set(),
  },
  activeIndex: {
    type: Number,
    default: -1,
  },
  tableClass: {
    type: [String, Array, Object],
    default: '',
  },
  enableResize: {
    type: Boolean,
    default: true,
  },
  enableSearch: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  searchValue: {
    type: String,
    default: undefined,
  },
  searchPlaceholder: {
    type: String,
    default: 'Tim kiem nhanh trong danh sach',
  },
  searchKeys: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['toggle-select-all', 'toggle-row-selection', 'row-click', 'update:searchValue'])

const tableRef = ref(null)
const selectAllRef = ref(null)
const localSearchValue = ref('')

const searchText = computed({
  get: () => (props.searchValue !== undefined ? props.searchValue : localSearchValue.value),
  set: (value) => {
    if (props.searchValue !== undefined) {
      emit('update:searchValue', value)
      return
    }
    localSearchValue.value = value
  },
})

const searchableKeys = computed(() => {
  if (props.searchKeys.length) return props.searchKeys
  return props.columns
    .map((column) => column.key)
    .filter((key) => key && key !== 'checkbox' && key !== 'actions')
})

const normalizedSearch = computed(() => searchText.value.trim().toLowerCase())

const displayRows = computed(() => {
  if (!props.enableSearch || !normalizedSearch.value) return props.rows
  const keys = searchableKeys.value
  return props.rows.filter((row) =>
    keys.some((key) => {
      const value = row?.[key]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(normalizedSearch.value)
    })
  )
})

const getRowKey = (row, index) => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (row && row[props.rowKey] !== undefined) return row[props.rowKey]
  return index
}

const isRowSelected = (row, index) => {
  if (!props.selectedIds || typeof props.selectedIds.has !== 'function') return false
  return props.selectedIds.has(getRowKey(row, index))
}

const isAllSelected = computed(() => {
  if (!props.rows.length) return false
  return props.rows.every((row, index) => isRowSelected(row, index))
})

const isSomeSelected = computed(() => {
  if (!props.rows.length) return false
  return props.rows.some((row, index) => isRowSelected(row, index))
})

watchEffect(() => {
  if (!selectAllRef.value) return
  selectAllRef.value.indeterminate = isSomeSelected.value && !isAllSelected.value
})

const handleSelectAllChange = (event) => {
  emit('toggle-select-all', event)
}

const handleRowSelectionChange = (row, index, event) => {
  emit('toggle-row-selection', { id: getRowKey(row, index), row, index, event })
}

const handleRowClick = (row, index) => {
  emit('row-click', { row, index })
}

const getCellClass = (column, row, index) => {
  const dynamicClass = column?.getCellClass ? column.getCellClass(row, index) : null
  return [column?.class, dynamicClass]
}

const getCellAttrs = (column, row, index) => {
  return column?.getCellAttrs ? column.getCellAttrs(row, index) : {}
}

const setColumnWidth = (table, key, width) => {
  if (!table || !key) return
  const cells = table.querySelectorAll(`[data-col="${key}"]`)
  cells.forEach((cell) => {
    cell.style.width = `${width}px`
  })
}

const enableColumnResize = () => {
  const table = tableRef.value
  if (!table || !props.enableResize) return

  const headers = Array.from(table.querySelectorAll('thead th[data-col]'))
  headers.forEach((th) => {
    th.querySelectorAll('.col-resizer').forEach((node) => node.remove())
  })

  const resizableHeaders = headers.filter((th) => {
    const key = th.dataset.col
    const column = props.columns.find((item) => String(item.key) === key)
    if (!column) return false
    if (column.resizable === false) return false
    if (column.type === 'selection') return false
    return true
  })

  resizableHeaders.forEach((th, index) => {
    if (index === resizableHeaders.length - 1) return

    const resizer = document.createElement('span')
    resizer.className = 'col-resizer'

    resizer.addEventListener('mousedown', (event) => {
      event.preventDefault()
      const startX = event.clientX
      const colKey = th.dataset.col
      const nextTh = resizableHeaders[index + 1]
      const nextKey = nextTh?.dataset.col
      const startWidth = th.offsetWidth
      const nextStartWidth = nextTh?.offsetWidth ?? 0
      const colCell = table.querySelector(`tbody td[data-col="${colKey}"]`)
      const nextCell = nextKey ? table.querySelector(`tbody td[data-col="${nextKey}"]`) : null
      const minWidth = parseInt(getComputedStyle(colCell || th).minWidth, 10) || 60
      const nextMinWidth = nextTh ? parseInt(getComputedStyle(nextCell || nextTh).minWidth, 10) || 60 : 60

      const onMouseMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX
        let newWidth = startWidth + delta
        let nextWidth = nextStartWidth - delta

        if (newWidth < minWidth) {
          newWidth = minWidth
          nextWidth = startWidth + nextStartWidth - newWidth
        }
        if (nextTh && nextWidth < nextMinWidth) {
          nextWidth = nextMinWidth
          newWidth = startWidth + nextStartWidth - nextWidth
        }

        setColumnWidth(table, colKey, newWidth)
        if (nextTh && nextKey) {
          setColumnWidth(table, nextKey, nextWidth)
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })

    th.appendChild(resizer)
  })
}

onMounted(() => {
  nextTick(enableColumnResize)
})

watch(
  () => props.columns,
  () => nextTick(enableColumnResize),
  { deep: true }
)
</script>

<template>
  <div class="ms-table">
    <Search v-if="enableSearch && showSearch" v-model="searchText" :placeholder="searchPlaceholder" />
    <table ref="tableRef" :class="tableClass">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.headerClass" :data-col="column.key">
            <template v-if="column.type === 'selection'">
              <input ref="selectAllRef" type="checkbox" :checked="isAllSelected"
                :aria-checked="isAllSelected ? 'true' : isSomeSelected ? 'mixed' : 'false'"
                @change="handleSelectAllChange" />
            </template>
            <template v-else>
              <slot :name="`header-${column.key}`" :column="column">{{ column.label }}</slot>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in displayRows" :key="getRowKey(row, index)"
          :class="[row?.rowClass, { 'row-selected': index === activeIndex }]" @click="handleRowClick(row, index)">
          <td v-for="column in columns" :key="column.key" :class="getCellClass(column, row, index)"
            :data-col="column.key" v-bind="getCellAttrs(column, row, index)">
            <template v-if="column.type === 'selection'">
              <input type="checkbox" class="row-select" :checked="isRowSelected(row, index)" @click.stop
                @change="(event) => handleRowSelectionChange(row, index, event)" />
            </template>
            <template v-else>
              <slot :name="`cell-${column.key}`" :row="row" :index="index" :value="row[column.key]"
                :column="column">
                {{ row[column.key] }}
              </slot>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
