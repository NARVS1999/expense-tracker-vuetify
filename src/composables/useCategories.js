import { ref, watch } from 'vue'

const STORAGE_KEY = 'expense_categories'
const defaultCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other']

export function useCategories() {
    const categories = ref([])

    function load() {
        const stored = localStorage.getItem(STORAGE_KEY)
        categories.value = stored ? JSON.parse(stored) : [...defaultCategories]
    }

    function add(name) {
        name = name.trim()
        if (name && !categories.value.includes(name)) {
            categories.value.push(name)
        }
    }

    function remove(name) {
        const idx = categories.value.indexOf(name)
        if (idx > -1) categories.value.splice(idx, 1)
    }

    // persist changes
    watch(categories, () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.value))
    }, { deep: true })

    load()
    return { categories, add, remove }
}