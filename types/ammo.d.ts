declare module "ammo" {
    export namespace Ammo {
        export class btDefaultCollisionConfiguration {}

        export class btPersistentManifold {}

        export class btConstraintSolver {}

        export class btDispatcher {
            getNumManifolds(): number;
            getManifoldByIndexInternal(index: number): btPersistentManifold;
        }

        export class btCollisionDispatcher extends btDispatcher {
            constructor(collisionConfiguration: btDefaultCollisionConfiguration);
        }

        export class btCollisionConfiguration {}

        export class btBroadphaseInterface {}

        export class btDbvtBroadphase extends btBroadphaseInterface {}

        export class btBroadphaseProxy {}

        export class btSequentialImpulseConstraintSolver {}

        export class btCollisionWorld {}

        export class btDynamicsWorld extends btCollisionWorld {}

        export class btDiscreteDynamicsWorld extends btDynamicsWorld {
            constructor(
                dispatcher: btDispatcher,
                pairCache: btBroadphaseInterface,
                constraintSolver: btConstraintSolver,
                collisionConfiguration: btCollisionConfiguration
            );
            setGravity(gravity: btVector3): void;
            getGravity(): btVector3;
            addRigidBody(body: btRigidBody): void;
            addRigidBody(body: btRigidBody, group: number, mask: number): void;
            removeRigidBody(body: btRigidBody): void;
            addConstraint(constraint: btTypedConstraint, disableCollisionsBetweenLinkedBodies?: boolean): void;
            removeConstraint(constraint: btTypedConstraint): void;
            stepSimulation(timeStep: number, maxSubSteps?: number, fixedTimeStep?: number): number;
        }

        export class btVector3 {
            constructor();
            constructor(x: number, y: number, z: number);
            x(): number;
            y(): number;
            z(): number;
            setX(x: number): void;
            setY(y: number): void;
            setZ(z: number): void;
            setValue(x: number, y: number, z: number): void;
            normalize(): void;
        }

        export class btVector4 extends btVector3 {
            constructor();
            constructor(x: number, y: number, z: number, w: number);
            w(): number;
            setValue(x: number, y: number, z: number): void;
            setValue(x: number, y: number, z: number, w: number): void;
        }

        export class btQuadWord {
            x(): number;
            y(): number;
            z(): number;
            w(): number;
            setX(x: number): void;
            setY(y: number): void;
            setZ(z: number): void;
            setW(w: number): void;
        }

        export class btQuaternion extends btQuadWord {
            constructor(x: number, y: number, z: number, w: number);
            setValue(x: number, y: number, z: number, w: number): void;
            setEulerZYX(z: number, y: number, x: number): void;
            setRotation(axis: btVector3, angle: number): void;
            normalize(): void;
            length2(): number;
            length(): number;
            dot(q: btQuaternion): number;
            normalized(): btQuaternion;
            getAxis(): btVector3;
            inverse(): btQuaternion;
            getAngle(): number;
            getAngleShortestPath(): number;
            angle(q: btQuaternion): number;
            angleShortestPath(q: btQuaternion): number;
            op_add(q: btQuaternion): btQuaternion;
            op_sub(q: btQuaternion): btQuaternion;
            op_mul(s: number): btQuaternion;
            op_mulq(q: btQuaternion): btQuaternion;
            op_div(s: number): btQuaternion;
        }

        export class btCollisionShape {
            setLocalScaling(scaling: btVector3): void;
            getLocalScaling(): btVector3;
            calculateLocalInertia(mass: number, inertia: btVector3): void;
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btBoxShape extends btCollisionShape {
            constructor(halfExtents: btVector3);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btTransform {
            constructor();
            constructor(q: btQuaternion, v: btVector3);
            setIdentity(): void;
            setOrigin(origin: btVector3): void;
            setRotation(rotation: btQuaternion): void;
            getOrigin(): btVector3;
            getRotation(): btQuaternion;
        }

        export class btMotionState {
            getWorldTransform(transform: btTransform): void;
            setWorldTransform(transform: btTransform): void;
        }

        export class btDefaultMotionState extends btMotionState {
            constructor(startTrans?: btTransform, centerOfMassOffset?: btTransform);
        }

        export class btCollisionObject {
            setAnisotropicFriction(anisotropicFriction: btVector3, frictionMode: number): void;
            getCollisionShape(): btCollisionShape;
            setContactProcessingThreshold(contactProcessingThreshold: number): void;
            setActivationState(newState: number): void;
            forceActivationState(newState: number): void;
            activate(forceActivation?: boolean): void;
            isActive(): boolean;
            isKinematicObject(): boolean;
            isStaticObject(): boolean;
            isStaticOrKinematicObject(): boolean;
            getRestitution(): number;
            getFriction(): number;
            getRollingFriction(): number;
            setRestitution(rest: number): void;
            setFriction(friction: number): void;
            setRollingFriction(friction: number): void;
            getWorldTransform(): btTransform;
            getCollisionFlags(): number;
            setCollisionFlags(flags: number): void;
            setWorldTransform(worldTrans: btTransform): void;
            setCollisionShape(collisionShape: btCollisionShape): void;
            setCcdMotionThreshold(ccdMotionThreshold: number): void;
            setCcdSweptSphereRadius(radius: number): void;
            getUserIndex(): number;
            setUserIndex(index: number): void;
            getUserPointer(): VoidPtr;
            setUserPointer(userPointer: VoidPtr): void;
            getBroadphaseHandle(): btBroadphaseProxy;
        }

        export class btRigidBodyConstructionInfo {
            constructor(
                mass: number,
                motionState: btMotionState,
                collisionShape: btCollisionShape,
                localInertia?: btVector3
            );
        }

        export class btRigidBody extends btCollisionObject {
            constructor(constructionInfo: btRigidBodyConstructionInfo);
            getCenterOfMassTransform(): btTransform;
            setCenterOfMassTransform(xform: btTransform): void;
            setSleepingThresholds(linear: number, angular: number): void;
            getLinearDamping(): number;
            getAngularDamping(): number;
            setDamping(lin_damping: number, ang_damping: number): void;
            setMassProps(mass: number, inertia: btVector3): void;
            getLinearFactor(): btVector3;
            setLinearFactor(linearFactor: btVector3): void;
            applyTorque(torque: btVector3): void;
            applyLocalTorque(torque: btVector3): void;
            applyForce(force: btVector3, rel_pos: btVector3): void;
            applyCentralForce(force: btVector3): void;
            applyCentralLocalForce(force: btVector3): void;
            applyTorqueImpulse(torque: btVector3): void;
            applyImpulse(impulse: btVector3, rel_pos: btVector3): void;
            applyCentralImpulse(impulse: btVector3): void;
            updateInertiaTensor(): void;
            getLinearVelocity(): btVector3;
            getAngularVelocity(): btVector3;
            setLinearVelocity(lin_vel: btVector3): void;
            setAngularVelocity(ang_vel: btVector3): void;
            getMotionState(): btMotionState;
            setMotionState(motionState: btMotionState): void;
            getAngularFactor(): btVector3;
            setAngularFactor(angularFactor: btVector3): void;
            upcast(colObj: btCollisionObject): btRigidBody;
            getAabb(aabbMin: btVector3, aabbMax: btVector3): void;
            applyGravity(): void;
            getGravity(): btVector3;
            setGravity(acceleration: btVector3): void;
            getBroadphaseProxy(): btBroadphaseProxy;
        }

        export class btTypedConstraint {
            enableFeedback(needsFeedback: boolean): void;
            getBreakingImpulseThreshold(): number;
            setBreakingImpulseThreshold(threshold: number): void;
            getParam(num: number, axis: number): number;
            setParam(num: number, value: number, axis: number): void;
        }
    }
    export type Ammo = typeof Ammo;
}
