"use strict";

import {ShaderMaterial} from "../build/three.module.js";

export default class SunShader extends ShaderMaterial {
    constructor({
                    mapInParameters = null, //Tekstur
                    colorInParameters = null //Farge som skal fargelegge videre
                }) {
        const vertexShader = `
            out vec2 vUv;
            uniform float uTime;
            void main(){
                vUv = uv;
                
                float wave = sin(position.y * 200.0 + uTime * 5.0) * 0.10;
                vec3 newPosition = position + normal * wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                
                
            }
        `;
        const fragmentShader = `
            uniform sampler2D textureInShader;
            uniform vec3 colorInShader;
            uniform float uTime;
            
            in vec2 vUv;
            
              void main(){
                vec3 base = texture(textureInShader, vUv).xyz * colorInShader;

                float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
                vec3 hot = base * vec3(1.6, 1.0, 0.5);
                gl_FragColor = vec4(mix(base, hot, pulse), 1.0);
            }
        `;

        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                textureInShader: {
                    value: mapInParameters
                },
                colorInShader: {
                    value: colorInParameters
                },
                uTime:{
                    value: 0
                }
            }
        });
    }
}