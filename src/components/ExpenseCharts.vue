<template>

    <v-row class="pa-4">
        <!-- Summary Stats -->
        <v-col cols="12" sm="6">
            <v-card class="pa-4 text-center" variant="elevated" rounded="lg" elevation="4">
                <v-icon size="36" color="primary">mdi-cash-multiple</v-icon>
                <div class="text-h6 mt-2"> <v-icon icon="mdi-currency-php" size="small" />{{ totalSpent.toFixed(2) }}
                </div>
                <div class="text-caption">Total Spent</div>
            </v-card>
        </v-col>

        <!-- Daily / Weekly / Monthly Chart -->
        <v-col cols="12" sm="6">
            <v-card variant="elevated" rounded="lg" elevation="4" class="pa-4">
                <v-card-title>Spending Trend</v-card-title>
                <v-card-text>
                    <canvas ref="lineCanvas" />
                </v-card-text>
            </v-card>
        </v-col>

        <!-- Category Pie Chart -->
        <v-col cols="12">
            <v-card variant="elevated" rounded="lg" elevation="4" class="pa-4">
                <v-card-title>By Category</v-card-title>
                <v-card-text>
                    <canvas ref="pieCanvas" />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, computed, watchEffect, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useCategories } from '@/composables/useCategories'
Chart.register(...registerables)

const { categories } = useCategories()

const expenses = ref(JSON.parse(localStorage.getItem('expenses') || '[]'))
const lineCanvas = ref(null)
const pieCanvas = ref(null)

let lineChart, pieChart

const totalSpent = computed(() =>
    expenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
)

function buildLineData() {
    const grouped = {}
    expenses.value.forEach(e => {
        const d = e.date
        grouped[d] = (grouped[d] || 0) + Number(e.amount)
    })
    const labels = Object.keys(grouped).sort()
    return {
        labels,
        datasets: [{
            label: 'Daily',
            data: labels.map(l => grouped[l]),
            borderColor: '#3f51b5',
            backgroundColor: 'rgba(63, 81, 181, 0.2)',
            fill: true
        }]
    }
}

function buildPieData() {
    const byCat = {}
    expenses.value.forEach(e => {
        byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount)
    })
    return {
        labels: Object.keys(byCat),
        datasets: [{
            data: Object.values(byCat),
            backgroundColor: ['#3f51b5', '#7986cb', '#9fa8da', '#c5cae9', '#e8eaf6']
        }]
    }
}

watchEffect(async () => {
    await nextTick()
    if (!lineCanvas.value || !pieCanvas.value) return

    expenses.value = JSON.parse(localStorage.getItem('expenses') || '[]')

    // Line chart
    if (lineChart) lineChart.destroy()
    lineChart = new Chart(lineCanvas.value, {
        type: 'line',
        data: buildLineData(),
        options: { responsive: true, maintainAspectRatio: false }
    })

    // Pie chart
    if (pieChart) pieChart.destroy()
    pieChart = new Chart(pieCanvas.value, {
        type: 'pie',
        data: buildPieData(),
        options: { responsive: true, maintainAspectRatio: false }
    })
})
</script>