<template>
    <v-card variant="elevated" rounded="lg" elevation="4" class="pa-4">
        <v-card-title class=" text-subtitle-1">Expenses</v-card-title>

        <!-- Filters -->
        <v-card-text>
            <v-row dense>
                <v-col cols="12" sm="4">
                    <v-text-field v-model="filters.date" label="Date" type="date" variant="outlined" density="compact"
                        clearable />
                </v-col>
                <v-col cols="12" sm="4">
                    <v-select v-model="filters.category" :items="categories" label="Category" variant="outlined"
                        density="compact" clearable />
                </v-col>
            </v-row>
        </v-card-text>

        <!-- Expense Cards -->
        <v-card-text>
            <v-data-table :items="filteredExpenses" :headers="headers" item-value="id" class="elevation-0">
                <template #item.amount="{ item }">
                    <span class="text-no-wrap">
                        <v-icon icon="mdi-currency-php" size="small" />
                        {{ item.amount.toFixed(2) }}
                    </span>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex ga-2">
                        <v-btn icon=" mdi-pencil" size="small" color="secondary" @click="$emit('edit', { ...item })" />
                        <v-btn icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)" />
                    </div>

                </template>
            </v-data-table>
            <v-dialog v-model="dialog" max-width="320">
                <v-card>
                    <v-card-title>Confirm deletion</v-card-title>
                    <v-card-text>Delete this expense permanently?</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="secondary" @click="dialog = false">Cancel</v-btn>
                        <v-btn color="error" @click="deleteExpense">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useCategories } from '@/composables/useCategories'

const { categories } = useCategories()
const emit = defineEmits(['edit'])
function edit(exp) {
    emit('edit', { ...exp })   // shallow clone
}

const expenses = ref([])
const filters = reactive({ date: '', category: '' })

const headers = [
    { title: 'Date', key: 'date' },
    { title: 'Description', key: 'description' },
    { title: 'Category', key: 'category' },
    { title: 'Amount', key: 'amount', align: 'end' },
    { title: '', key: 'actions', sortable: false, align: 'end' }
]

const dialog = ref(false)
const toDelete = ref(null)

function confirmDelete(item) {
    toDelete.value = item
    dialog.value = true
}

function deleteExpense() {
    const list = JSON.parse(localStorage.getItem('expenses') || '[]')
    const idx = list.findIndex(e => e.id === toDelete.value.id)
    if (idx !== -1) {
        list.splice(idx, 1)
        localStorage.setItem('expenses', JSON.stringify(list))
    }
    dialog.value = false
    loadExpenses()   // reload UI
}

onMounted(() => {
    expenses.value = JSON.parse(localStorage.getItem('expenses') || '[]')
})

const filteredExpenses = computed(() =>
    expenses.value.filter(e =>
        (!filters.date || e.date === filters.date) &&
        (!filters.category || e.category === filters.category)
    )
)

function loadExpenses() {
    expenses.value = JSON.parse(localStorage.getItem('expenses') || '[]')
}
onMounted(loadExpenses)
defineExpose({ loadExpenses })
</script>