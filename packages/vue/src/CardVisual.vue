<script setup>
import { computed } from 'vue'
import {
  CHIP_SVG,
  RED_LOGO_SVG,
  formatDisplayNumber,
} from '@cuban-cards/core'
import bandecLogo from '../../core/src/assets/bandec-isotipo.png?no-inline'
import bpaLogo from '../../core/src/assets/bpa-isotipo.png?no-inline'
import metropolitanoLogo from '../../core/src/assets/metropolitano-isotipo.png?no-inline'

const props = defineProps({
  analysis: { type: Object, default: null },
  size: { type: String, default: 'default' },
})

const colors = computed(() => props.analysis?.colors || ['#0071e3', '#42a5f5'])
const themeKey = computed(() => props.analysis?.theme || 'default')
const bankName = computed(() =>
  props.analysis?.banks?.length > 0
    ? props.analysis.banks[0].name
    : 'Tarjeta cubana',
)
const networkLabel = computed(() =>
  props.analysis?.network
    ? `${props.analysis.network} · ${props.analysis.product || 'Tarjeta'}`
    : 'Sin identificar',
)
const displayNumber = computed(
  () =>
    props.analysis?.displayNumber ||
    formatDisplayNumber('', props.analysis?.cardLength || 16),
)
const netLogoSvg = computed(() =>
  props.analysis?.network === 'RED' ? RED_LOGO_SVG : CHIP_SVG,
)
</script>

<template>
  <div class="ccc-twrap">
    <div
      class="ccc-tcard"
      :data-card="themeKey"
      :data-size="size"
      :style="{ '--ccc-a1': colors[0], '--ccc-a2': colors[1] }"
    >
      <div class="ccc-deco ccc-deco-edge">
        <span>BANCO DE CRÉDITO Y COMERCIO</span>
      </div>

      <div class="ccc-deco ccc-deco-ribbons" aria-hidden="true">
        <svg
          viewBox="0 0 120 200"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <polygon points="0,0 46,0 20,200 0,200" fill="#0e4d8f" />
          <polygon
            points="30,0 62,0 96,200 58,200"
            fill="#12a5b8"
            opacity="0.85"
          />
          <polygon points="52,0 70,0 128,200 96,200" fill="#0a3566" />
        </svg>
      </div>

      <div class="ccc-deco ccc-deco-swoosh" aria-hidden="true">
        <svg
          viewBox="0 0 300 120"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <path
            d="M300 8 C 190 26, 120 44, 0 108"
            stroke="#0b5563"
            stroke-width="7"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M300 30 C 200 48, 130 66, 8 122"
            stroke="#7fb3b0"
            stroke-width="5"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M300 52 C 215 68, 150 84, 30 128"
            stroke="#0b5563"
            stroke-width="3.5"
            fill="none"
            opacity="0.45"
          />
        </svg>
      </div>

      <div class="ccc-deco ccc-deco-palm" aria-hidden="true">
        <svg
          viewBox="0 0 100 120"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax meet"
        >
          <g fill="#14663f">
            <path d="M52 118 C 50 84, 48 58, 40 34 L 47 32 C 55 58, 57 86, 59 118 Z" />
            <path d="M44 32 C 30 18, 14 14, 2 20 C 14 24, 26 30, 40 38 Z" />
            <path d="M45 30 C 38 12, 26 2, 12 0 C 22 10, 32 20, 41 34 Z" />
            <path d="M47 29 C 50 10, 60 0, 74 0 C 64 10, 56 20, 50 33 Z" />
            <path d="M48 31 C 62 18, 78 14, 92 20 C 79 24, 64 31, 51 38 Z" />
            <path d="M47 34 C 64 30, 82 34, 94 46 C 80 42, 63 40, 50 40 Z" />
          </g>
        </svg>
      </div>

      <div class="ccc-deco ccc-deco-lime">
        <span class="ccc-vert">Banco Metropolitano</span>
        <img
          class="ccc-logo-metropolitano"
          :src="metropolitanoLogo"
          alt="Banco Metropolitano"
        />
      </div>

      <div class="ccc-trow">
        <div class="ccc-brand-slot">
          <div class="ccc-brand ccc-brand-default">
            <div>
              <div class="ccc-wm">{{ bankName }}</div>
              <div class="ccc-tnet">{{ networkLabel }}</div>
            </div>
          </div>

          <div class="ccc-brand ccc-brand-bandec">
            <img class="ccc-logo-bandec" :src="bandecLogo" alt="BANDEC" />
            <div>
              <div class="ccc-wm">bandec</div>
              <div class="ccc-micro">
                Banco de crédito
                <br />y comercio
              </div>
            </div>
          </div>

          <div class="ccc-brand ccc-brand-bpa">
            <img class="ccc-logo-bpa" :src="bpaLogo" alt="BPA" />
          </div>

          <div class="ccc-brand ccc-brand-clasica">
            <div>
              <div class="ccc-wm ccc-wm-clasica">FINCIMEX</div>
              <div class="ccc-micro">Financiera CIMEX S.A.</div>
            </div>
          </div>

          <div class="ccc-brand ccc-brand-tropical">
            <img
              class="ccc-logo-bandec-tropical"
              :src="bandecLogo"
              alt="BANDEC"
            />
            <div>
              <div class="ccc-wm ccc-wm-tropical">bandec</div>
              <div class="ccc-micro">Banco de crédito y comercio</div>
            </div>
          </div>

          <div class="ccc-brand ccc-brand-bicsa">
            <div>
              <div class="ccc-wm">BICSA</div>
              <div class="ccc-micro">
                Banco Internacional
                <br />de Comercio S.A.
              </div>
            </div>
          </div>
        </div>

        <div class="ccc-netlogo" aria-hidden="true" v-html="netLogoSvg"></div>
      </div>

      <div class="ccc-tcenter">
        <div class="ccc-clas">Clásica</div>
        <div class="ccc-sub2">TARJETA DE INCENTIVOS</div>
      </div>

      <div class="ccc-tnumwrap">
        <div class="ccc-tnum">{{ displayNumber }}</div>
      </div>

      <div class="ccc-troplabel">TROPICAL</div>

      <div class="ccc-tmeta">
        <span class="ccc-pill ccc-solid">
          {{ analysis?.product || '-' }}
        </span>
        <span class="ccc-pill">
          {{
            analysis?.currency
              ? `${analysis.currency}${analysis.mlc ? ' · respaldo MLC' : ''}`
              : '-'
          }}
        </span>
        <span v-if="analysis?.luhn != null" class="ccc-pill">
          {{ analysis.luhn ? 'Luhn válido' : 'Luhn no válido' }}
        </span>
      </div>
    </div>
  </div>
</template>
