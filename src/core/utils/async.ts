import {AsyncParticleStates} from '../enums';
import {AsyncParticle} from '../interfaces';


export function initAsyncParticle<T>(data: T | null = null): AsyncParticle<T> {
  return {
    data,
    state: AsyncParticleStates.IDLE,
    error: null,
  };
}

export function isAsyncIdle(particle: AsyncParticle<any>): boolean {
  return particle.state === AsyncParticleStates.IDLE;
}

export function isAsyncLoading(particle: AsyncParticle<any>): boolean {
  return particle.state === AsyncParticleStates.LOADING;
}

export function isAsyncFailed(particle: AsyncParticle<any>): boolean {
  return particle.state === AsyncParticleStates.FAILED;
}

export function isAsyncSuccess(particle: AsyncParticle<any>): boolean {
  return particle.state === AsyncParticleStates.SUCCESS;
}
