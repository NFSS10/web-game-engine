declare module "ammo" {
    export namespace Ammo {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export function destroy(obj: any): void;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export function wrapPointer(ptr: number, castType: any): any;

        export class DebugDrawer {
            constructor();
            drawLine(ptr: number, ptr: number, ptr: number): void;
            drawContactPoint(
                pointOnB: btVector3,
                normalOnB: btVector3,
                distance: number,
                lifeTime: number,
                color: btVector3
            ): void;
            reportErrorWarning(warningString: string): void;
            draw3dText(location: btVector3, textString: string): void;
            setDebugMode(debugMode: DebugDrawMode): void;
            getDebugMode(): DebugDrawMode;
        }

        export class btDefaultCollisionConfiguration {}

        export class btPersistentManifold {
            getBody0(): btCollisionObject;
            getBody1(): btCollisionObject;
            getNumContacts(): number;
            getContactPoint(index: number): btManifoldPoint;
        }

        export class btConstraintSolver {}

        export class btDispatcher {
            getNumManifolds(): number;
            getManifoldByIndexInternal(index: number): btPersistentManifold;
        }

        export class ContactResultCallback {}

        export class btCollisionDispatcher extends btDispatcher {
            constructor(collisionConfiguration: btDefaultCollisionConfiguration);
        }

        export class btOverlappingPairCallback {}

        export class btOverlappingPairCache {
            setInternalGhostPairCallback(ghostPairCallback: btOverlappingPairCallback): void;
            getNumOverlappingPairs(): number;
        }

        export class btCollisionConfiguration {}

        export class btBroadphaseInterface {}

        export class btDbvtBroadphase extends btBroadphaseInterface {}

        export class btBroadphaseProxy {}

        export class btSequentialImpulseConstraintSolver {}

        export class btDispatcherInfo {
            get_m_timeStep(): number;
            set_m_timeStep(m_timeStep: number): void;
            get_m_stepCount(): number;
            set_m_stepCount(m_stepCount: number): void;
            get_m_dispatchFunc(): number;
            set_m_dispatchFunc(m_dispatchFunc: number): void;
            get_m_timeOfImpact(): number;
            set_m_timeOfImpact(m_timeOfImpact: number): void;
            get_m_useContinuous(): boolean;
            set_m_useContinuous(m_useContinuous: boolean): void;
            get_m_enableSatConvex(): boolean;
            set_m_enableSatConvex(m_enableSatConvex: boolean): void;
            get_m_enableSPU(): boolean;
            set_m_enableSPU(m_enableSPU: boolean): void;
            get_m_useEpa(): boolean;
            set_m_useEpa(m_useEpa: boolean): void;
            get_m_allowedCcdPenetration(): number;
            set_m_allowedCcdPenetration(m_allowedCcdPenetration: number): void;
            get_m_useConvexConservativeDistanceUtil(): boolean;
            set_m_useConvexConservativeDistanceUtil(m_useConvexConservativeDistanceUtil: boolean): void;
            get_m_convexConservativeDistanceThreshold(): number;
            set_m_convexConservativeDistanceThreshold(m_convexConservativeDistanceThreshold: number): void;
        }

        export class btCollisionWorld {
            getDispatcher(): btDispatcher;
            rayTest(rayFromWorld: btVector3, rayToWorld: btVector3, resultCallback: RayResultCallback): void;
            getPairCache(): btOverlappingPairCache;
            getDispatchInfo(): btDispatcherInfo;
            addCollisionObject(
                collisionObject: btCollisionObject,
                collisionFilterGroup?: number,
                collisionFilterMask?: number
            ): void;
            removeCollisionObject(collisionObject: btCollisionObject): void;
            getBroadphase(): btBroadphaseInterface;
            convexSweepTest(
                castShape: btConvexShape,
                from: btTransform,
                to: btTransform,
                resultCallback: ConvexResultCallback,
                allowedCcdPenetration: number
            ): void;
            contactPairTest(
                colObjA: btCollisionObject,
                colObjB: btCollisionObject,
                resultCallback: ContactResultCallback
            ): void;
            contactTest(colObj: btCollisionObject, resultCallback: ContactResultCallback): void;
            updateSingleAabb(colObj: btCollisionObject): void;
            setDebugDrawer(debugDrawer: btIDebugDraw): void;
            getDebugDrawer(): btIDebugDraw;
            debugDrawWorld(): void;
            debugDrawObject(worldTransform: btTransform, shape: btCollisionShape, color: btVector3): void;
        }

        export class btManifoldPoint {
            getPositionWorldOnA(): btVector3;
            getPositionWorldOnB(): btVector3;
            getAppliedImpulse(): number;
            getDistance(): number;
        }

        export class btActionInterface {
            updateAction(collisionWorld: btCollisionWorld, deltaTimeStep: number): void;
        }

        export class btDynamicsWorld extends btCollisionWorld {
            addAction(action: btActionInterface): void;
            removeAction(action: btActionInterface): void;
        }

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

        export class btRaycastVehicle extends btActionInterface {
            constructor(tuning: btVehicleTuning, chassis: btRigidBody, raycaster: btVehicleRaycaster);
            applyEngineForce(force: number, wheel: number): void;
            setSteeringValue(steering: number, wheel: number): void;
            getWheelTransformWS(wheelIndex: number): btTransform;
            updateWheelTransform(wheelIndex: number, interpolatedTransform: boolean): void;
            addWheel(
                connectionPointCS0: btVector3,
                wheelDirectionCS0: btVector3,
                wheelAxleCS: btVector3,
                suspensionRestLength: number,
                wheelRadius: number,
                tuning: btVehicleTuning,
                isFrontWheel: boolean
            ): btWheelInfo;
            getNumWheels(): number;
            getRigidBody(): btRigidBody;
            getWheelInfo(index: number): btWheelInfo;
            setBrake(brake: number, wheelIndex: number): void;
            setCoordinateSystem(rightIndex: number, upIndex: number, forwardIndex: number): void;
            getCurrentSpeedKmHour(): number;
            getChassisWorldTransform(): btTransform;
            rayCast(wheel: btWheelInfo): number;
            updateVehicle(step: number): void;
            resetSuspension(): void;
            getSteeringValue(wheel: number): number;
            updateWheelTransformsWS(wheel: btWheelInfo, interpolatedTransform?: boolean): void;
            setPitchControl(pitch: number): void;
            updateSuspension(deltaTime: number): void;
            updateFriction(timeStep: number): void;
            getRightAxis(): number;
            getUpAxis(): number;
            getForwardAxis(): number;
            getForwardVector(): btVector3;
            getUserConstraintType(): number;
            setUserConstraintType(userConstraintType: number): void;
            setUserConstraintId(uid: number): void;
            getUserConstraintId(): number;
        }

        export class btVehicleTuning {
            get_m_suspensionStiffness(): number;
            set_m_suspensionStiffness(m_suspensionStiffness: number): void;
            get_m_suspensionCompression(): number;
            set_m_suspensionCompression(m_suspensionCompression: number): void;
            get_m_suspensionDamping(): number;
            set_m_suspensionDamping(m_suspensionDamping: number): void;
            get_m_maxSuspensionTravelCm(): number;
            set_m_maxSuspensionTravelCm(m_maxSuspensionTravelCm: number): void;
            get_m_frictionSlip(): number;
            set_m_frictionSlip(m_frictionSlip: number): void;
            get_m_maxSuspensionForce(): number;
            set_m_maxSuspensionForce(m_maxSuspensionForce: number): void;
        }

        export class btVehicleRaycaster {
            castRay(from: btVector3, to: btVector3, result: btVehicleRaycasterResult): void;
        }

        export class btDefaultVehicleRaycaster extends btVehicleRaycaster {
            constructor(world: btDynamicsWorld);
        }

        export class btVehicleRaycasterResult {
            get_m_hitPointInWorld(): btVector3;
            set_m_hitPointInWorld(m_hitPointInWorld: btVector3): void;
            get_m_hitNormalInWorld(): btVector3;
            set_m_hitNormalInWorld(m_hitNormalInWorld: btVector3): void;
            get_m_distFraction(): number;
            set_m_distFraction(m_distFraction: number): void;
        }

        export class btWheelInfo {
            constructor(ci: btWheelInfoConstructionInfo);
            get_m_suspensionStiffness(): number;
            set_m_suspensionStiffness(m_suspensionStiffness: number): void;
            get_m_frictionSlip(): number;
            set_m_frictionSlip(m_frictionSlip: number): void;
            get_m_engineForce(): number;
            set_m_engineForce(m_engineForce: number): void;
            get_m_rollInfluence(): number;
            set_m_rollInfluence(m_rollInfluence: number): void;
            get_m_suspensionRestLength1(): number;
            set_m_suspensionRestLength1(m_suspensionRestLength1: number): void;
            get_m_wheelsRadius(): number;
            set_m_wheelsRadius(m_wheelsRadius: number): void;
            get_m_wheelsDampingCompression(): number;
            set_m_wheelsDampingCompression(m_wheelsDampingCompression: number): void;
            get_m_wheelsDampingRelaxation(): number;
            set_m_wheelsDampingRelaxation(m_wheelsDampingRelaxation: number): void;
            get_m_steering(): number;
            set_m_steering(m_steering: number): void;
            get_m_maxSuspensionForce(): number;
            set_m_maxSuspensionForce(m_maxSuspensionForce: number): void;
            get_m_maxSuspensionTravelCm(): number;
            set_m_maxSuspensionTravelCm(m_maxSuspensionTravelCm: number): void;
            get_m_wheelsSuspensionForce(): number;
            set_m_wheelsSuspensionForce(m_wheelsSuspensionForce: number): void;
            get_m_bIsFrontWheel(): boolean;
            set_m_bIsFrontWheel(m_bIsFrontWheel: boolean): void;
            get_m_raycastInfo(): RaycastInfo;
            set_m_raycastInfo(m_raycastInfo: RaycastInfo): void;
            get_m_chassisConnectionPointCS(): btVector3;
            set_m_chassisConnectionPointCS(m_chassisConnectionPointCS: btVector3): void;
            getSuspensionRestLength(): number;
            updateWheel(chassis: btRigidBody, raycastInfo: RaycastInfo): void;
            get_m_worldTransform(): btTransform;
            set_m_worldTransform(m_worldTransform: btTransform): void;
            get_m_wheelDirectionCS(): btVector3;
            set_m_wheelDirectionCS(m_wheelDirectionCS: btVector3): void;
            get_m_wheelAxleCS(): btVector3;
            set_m_wheelAxleCS(m_wheelAxleCS: btVector3): void;
            get_m_rotation(): number;
            set_m_rotation(m_rotation: number): void;
            get_m_deltaRotation(): number;
            set_m_deltaRotation(m_deltaRotation: number): void;
            get_m_brake(): number;
            set_m_brake(m_brake: number): void;
            get_m_clippedInvContactDotSuspension(): number;
            set_m_clippedInvContactDotSuspension(m_clippedInvContactDotSuspension: number): void;
            get_m_suspensionRelativeVelocity(): number;
            set_m_suspensionRelativeVelocity(m_suspensionRelativeVelocity: number): void;
            get_m_skidInfo(): number;
            set_m_skidInfo(m_skidInfo: number): void;
        }

        export class btWheelInfoConstructionInfo {
            get_m_chassisConnectionCS(): btVector3;
            set_m_chassisConnectionCS(m_chassisConnectionCS: btVector3): void;
            get_m_wheelDirectionCS(): btVector3;
            set_m_wheelDirectionCS(m_wheelDirectionCS: btVector3): void;
            get_m_wheelAxleCS(): btVector3;
            set_m_wheelAxleCS(m_wheelAxleCS: btVector3): void;
            get_m_suspensionRestLength(): number;
            set_m_suspensionRestLength(m_suspensionRestLength: number): void;
            get_m_maxSuspensionTravelCm(): number;
            set_m_maxSuspensionTravelCm(m_maxSuspensionTravelCm: number): void;
            get_m_wheelRadius(): number;
            set_m_wheelRadius(m_wheelRadius: number): void;
            get_m_suspensionStiffness(): number;
            set_m_suspensionStiffness(m_suspensionStiffness: number): void;
            get_m_wheelsDampingCompression(): number;
            set_m_wheelsDampingCompression(m_wheelsDampingCompression: number): void;
            get_m_wheelsDampingRelaxation(): number;
            set_m_wheelsDampingRelaxation(m_wheelsDampingRelaxation: number): void;
            get_m_frictionSlip(): number;
            set_m_frictionSlip(m_frictionSlip: number): void;
            get_m_maxSuspensionForce(): number;
            set_m_maxSuspensionForce(m_maxSuspensionForce: number): void;
            get_m_bIsFrontWheel(): boolean;
            set_m_bIsFrontWheel(m_bIsFrontWheel: boolean): void;
        }

        export class RaycastInfo {
            get_m_contactNormalWS(): btVector3;
            set_m_contactNormalWS(m_contactNormalWS: btVector3): void;
            get_m_contactPointWS(): btVector3;
            set_m_contactPointWS(m_contactPointWS: btVector3): void;
            get_m_suspensionLength(): number;
            set_m_suspensionLength(m_suspensionLength: number): void;
            get_m_hardPointWS(): btVector3;
            set_m_hardPointWS(m_hardPointWS: btVector3): void;
            get_m_wheelDirectionWS(): btVector3;
            set_m_wheelDirectionWS(m_wheelDirectionWS: btVector3): void;
            get_m_wheelAxleWS(): btVector3;
            set_m_wheelAxleWS(m_wheelAxleWS: btVector3): void;
            get_m_isInContact(): boolean;
            set_m_isInContact(m_isInContact: boolean): void;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get_m_groundObject(): any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            set_m_groundObject(m_groundObject: any): void;
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

        export class btConvexShape extends btCollisionShape {}

        export class btStridingMeshInterface {
            setScaling(scaling: btVector3): void;
        }

        export class btConvexTriangleMeshShape extends btConvexShape {
            constructor(meshInterface: btStridingMeshInterface, calcAabb?: boolean);
        }

        export class btBoxShape extends btCollisionShape {
            constructor(boxHalfExtents: btVector3);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btCapsuleShape extends btCollisionShape {
            constructor(radius: number, height: number);
            setMargin(margin: number): void;
            getMargin(): number;
            getUpAxis(): number;
            getRadius(): number;
            getHalfHeight(): number;
        }

        export class btCapsuleShapeX extends btCapsuleShape {
            constructor(radius: number, height: number);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btCapsuleShapeZ extends btCapsuleShape {
            constructor(radius: number, height: number);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btCylinderShape extends btCollisionShape {
            constructor(halfExtents: btVector3);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btCylinderShapeX extends btCylinderShape {
            constructor(halfExtents: btVector3);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btCylinderShapeZ extends btCylinderShape {
            constructor(halfExtents: btVector3);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btSphereShape extends btCollisionShape {
            constructor(radius: number);
            setMargin(margin: number): void;
            getMargin(): number;
        }

        export class btMultiSphereShape extends btCollisionShape {
            constructor(positions: btVector3, radii: ReadonlyArray<number>, numPoints: number);
        }

        export class btConeShape extends btCollisionShape {
            constructor(radius: number, height: number);
        }

        export class btConeShapeX extends btConeShape {
            constructor(radius: number, height: number);
        }

        export class btConeShapeZ extends btConeShape {
            constructor(radius: number, height: number);
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

        export class RayResultCallback {
            hasHit(): boolean;
            get_m_collisionFilterGroup(): number;
            set_m_collisionFilterGroup(m_collisionFilterGroup: number): void;
            get_m_collisionFilterMask(): number;
            set_m_collisionFilterMask(m_collisionFilterMask: number): void;
            get_m_closestHitFraction(): number;
            set_m_closestHitFraction(m_closestHitFraction: number): void;
            get_m_collisionObject(): btCollisionObject;
            set_m_collisionObject(m_collisionObject: btCollisionObject): void;
        }

        export class ClosestRayResultCallback extends RayResultCallback {
            constructor(from: btVector3, to: btVector3);
            get_m_rayFromWorld(): btVector3;
            set_m_rayFromWorld(m_rayFromWorld: btVector3): void;
            get_m_rayToWorld(): btVector3;
            set_m_rayToWorld(m_rayToWorld: btVector3): void;
            get_m_hitNormalWorld(): btVector3;
            set_m_hitNormalWorld(m_hitNormalWorld: btVector3): void;
            get_m_hitPointWorld(): btVector3;
            set_m_hitPointWorld(m_hitPointWorld: btVector3): void;
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
