<template>
  <v-app>
    <v-main>
      <v-container>
        <ExpenseForm :edit-expense="editing" @saved="onSaved" />
        <ExpenseList ref="expenseListRef" @edit="editing = $event" />
        <ExpenseCharts />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const expenseListRef = ref(null)
const editing = ref(null)

function onSaved() {
  editing.value = null
  expenseListRef.value?.loadExpenses()
}
</script>