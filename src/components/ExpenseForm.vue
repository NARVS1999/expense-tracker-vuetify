<template>
    <v-form ref="form" @submit.prevent="handleSubmit" class="pa-4">
        <!-- Description -->
        <v-text-field variant="outlined" rounded="lg" v-model="expense.description" label="Description"
            :rules="[v => !!v || 'Required']" required prepend-inner-icon="mdi-note-text" />

        <!-- Amount -->
        <v-text-field variant="outlined" rounded="lg" v-model.number="expense.amount" label="Amount" type="number"
            :rules="[
                v => v !== '' || 'Required',
                v => v > 0 || 'Must be positive'
            ]" required prepend-inner-icon="mdi-currency-php" />

        <!-- Category -->
        <v-select variant="outlined" rounded="lg" v-model="expense.category" :items="categories" label="Category"
            :rules="[v => !!v || 'Required']" required prepend-inner-icon="mdi-shape" />

        <!-- Date -->
        <v-text-field variant="outlined" rounded="lg" v-model="expense.date" label="Date" type="date"
            :rules="[v => !!v || 'Required']" required prepend-inner-icon="mdi-calendar" />

        <!-- Submit -->
        <v-btn variant="elevated" rounded="lg" color="secondary" type="submit" block prepend-icon="mdi-plus">
            Add Expense
        </v-btn>
    </v-form>
</template>

<script setup>
import { useCategories } from '@/composables/useCategories'

const { categories } = useCategories()

const props = defineProps({ editExpense: { type: Object, default: null } })
const isEdit = computed(() => !!props.editExpense)



const emit = defineEmits(['saved'])
const form = ref(null)


const expense = reactive({
    id: '',
    amount: null,
    category: '',
    date: new Date().toISOString().substr(0, 10),
    description: ''
})

watch(() => props.editExpense,
    (val) => {
        if (val) Object.assign(expense, val)
        else form.value?.reset()
    },
    { immediate: true }
)

function handleSubmit() {
    form.value.validate().then(({ valid }) => {
        if (!valid) return
        if (isEdit.value) updateExpense({ ...expense })
        else saveExpense({ ...expense })
        emit('saved')
    })
}

function updateExpense(updated) {
    const list = JSON.parse(localStorage.getItem('expenses') || '[]')
    const idx = list.findIndex(e => e.id === updated.id)
    if (idx !== -1) {
        list[idx] = updated
        localStorage.setItem('expenses', JSON.stringify(list))
    }
}

function saveExpense(item) {
    const list = JSON.parse(localStorage.getItem('expenses') || '[]')
    list.unshift(item)
    localStorage.setItem('expenses', JSON.stringify(list))
}
</script>